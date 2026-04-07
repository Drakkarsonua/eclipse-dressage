import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CalendarEvent {
  title: string;
  startDate: string; // ISO format YYYY-MM-DD
  endDate: string;   // ISO format YYYY-MM-DD
  displayDate: string; // Original Ukrainian text for display
  location: string;
  tags: string[];
  status: "live" | "upcoming";
}

/* ------------------------------------------------------------------ */
/*  Ukrainian month parser                                             */
/* ------------------------------------------------------------------ */

const UA_MONTHS: Record<string, number> = {
  "січня": 0,
  "лютого": 1,
  "березня": 2,
  "квітня": 3,
  "травня": 4,
  "червня": 5,
  "липня": 6,
  "серпня": 7,
  "вересня": 8,
  "жовтня": 9,
  "листопада": 10,
  "грудня": 11,
};

/**
 * Parse the date+location text from an event item.
 *
 * Formats observed:
 *   "2 по 5 квітня 2026, Location..."
 *   "16 по 18 квітня 2026, Location..."
 *   "30 квітня по 3 травня 2026, Location..."
 *   "10 червня 2026, Location..."  (single-day event)
 */
function parseDateLocation(raw: string): {
  startDate: Date | null;
  endDate: Date | null;
  displayDate: string;
  location: string;
} {
  // Normalise whitespace
  const text = raw.replace(/\s+/g, " ").trim();

  // Split at first comma that separates date from location
  // The date portion ends after the year (4-digit number)
  const yearMatch = text.match(/\d{4}/);
  if (!yearMatch || yearMatch.index === undefined) {
    return { startDate: null, endDate: null, displayDate: text, location: "" };
  }

  const yearEnd = yearMatch.index + 4;
  const datePart = text.slice(0, yearEnd).trim();
  let location = text.slice(yearEnd).replace(/^[,\s]+/, "").trim();

  // Find month and year in date part
  const monthNames = Object.keys(UA_MONTHS);
  const year = parseInt(yearMatch[0]);

  let startDate: Date | null = null;
  let endDate: Date | null = null;

  // Pattern: "30 квітня по 3 травня 2026" (cross-month range)
  const crossMonthMatch = datePart.match(
    new RegExp(`(\\d{1,2})\\s+(${monthNames.join("|")})\\s+по\\s+(\\d{1,2})\\s+(${monthNames.join("|")})\\s+(\\d{4})`)
  );
  if (crossMonthMatch) {
    const startDay = parseInt(crossMonthMatch[1]);
    const startMonth = UA_MONTHS[crossMonthMatch[2]];
    const endDay = parseInt(crossMonthMatch[3]);
    const endMonth = UA_MONTHS[crossMonthMatch[4]];
    startDate = new Date(year, startMonth, startDay);
    endDate = new Date(year, endMonth, endDay);
  }

  if (!startDate) {
    // Pattern: "2 по 5 квітня 2026" (same-month range)
    const sameMonthMatch = datePart.match(
      new RegExp(`(\\d{1,2})\\s+по\\s+(\\d{1,2})\\s+(${monthNames.join("|")})\\s+(\\d{4})`)
    );
    if (sameMonthMatch) {
      const startDay = parseInt(sameMonthMatch[1]);
      const endDay = parseInt(sameMonthMatch[2]);
      const month = UA_MONTHS[sameMonthMatch[3]];
      startDate = new Date(year, month, startDay);
      endDate = new Date(year, month, endDay);
    }
  }

  if (!startDate) {
    // Pattern: "10 червня 2026" (single day)
    const singleDayMatch = datePart.match(
      new RegExp(`(\\d{1,2})\\s+(${monthNames.join("|")})\\s+(\\d{4})`)
    );
    if (singleDayMatch) {
      const day = parseInt(singleDayMatch[1]);
      const month = UA_MONTHS[singleDayMatch[2]];
      startDate = new Date(year, month, day);
      endDate = new Date(year, month, day);
    }
  }

  return {
    startDate,
    endDate,
    displayDate: datePart,
    location,
  };
}

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getStatus(start: Date, end: Date): "live" | "upcoming" {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(0, 0, 0, 0);

  if (today >= s && today <= e) return "live";
  return "upcoming";
}

/* ------------------------------------------------------------------ */
/*  Scraper                                                            */
/* ------------------------------------------------------------------ */

const BASE_URL = "https://efu.org.ua";
const EVENTS_PATH = "/events/dressage/ukrainian/";
const MAX_PAGES = 10;

async function fetchPage(page: number): Promise<string> {
  const url =
    page === 1
      ? `${BASE_URL}${EVENTS_PATH}`
      : `${BASE_URL}${EVENTS_PATH}page/${page}?dir=next`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; EclipseDressageBot/1.0)",
      Accept: "text/html",
    },
    redirect: "follow",
  });

  if (!res.ok) return "";
  return res.text();
}

function parseEventsFromHTML(html: string): CalendarEvent[] {
  const $ = cheerio.load(html);
  const events: CalendarEvent[] = [];

  $("ul.events_list > li").each((_, li) => {
    const $li = $(li);
    const title = $li.find("a.title").first().text().trim();
    if (!title) return;

    // Extract tags from link_red anchors
    const tags: string[] = [];
    $li.find("a.link_red").each((_, a) => {
      const tag = $(a).text().trim();
      if (tag) tags.push(tag);
    });

    // Only keep events that have the "Виїздка" tag
    if (!tags.includes("Виїздка")) return;

    // The date+location text is in the second .pr div, after the tag links
    // Get the full text of the info line, then strip out tag texts
    const infoDiv = $li.find("div.fs13").first();
    let infoText = infoDiv.text().trim();
    // Remove tag texts from the beginning
    for (const tag of tags) {
      infoText = infoText.replace(tag, "");
    }
    infoText = infoText.replace(/\s+/g, " ").trim();

    const { startDate, endDate, displayDate, location } =
      parseDateLocation(infoText);

    if (!startDate || !endDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endCmp = new Date(endDate);
    endCmp.setHours(0, 0, 0, 0);

    // Filter: only future events (endDate >= today)
    if (endCmp < today) return;

    events.push({
      title,
      startDate: toISO(startDate),
      endDate: toISO(endDate),
      displayDate,
      location,
      tags,
      status: getStatus(startDate, endDate),
    });
  });

  return events;
}

async function scrapeAllEvents(): Promise<CalendarEvent[]> {
  const allEvents: CalendarEvent[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const html = await fetchPage(page);
    if (!html) break;

    const $ = cheerio.load(html);
    const hasEvents = $("ul.events_list > li").length > 0;
    if (!hasEvents) break;

    const events = parseEventsFromHTML(html);
    allEvents.push(...events);

    // Check if there's a next page
    const hasNextPage =
      $(`a[href*="page/${page + 1}"]`).length > 0;
    if (!hasNextPage) break;
  }

  // Sort by start date ascending
  allEvents.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return allEvents;
}

/* ------------------------------------------------------------------ */
/*  Cache (1 hour)                                                     */
/* ------------------------------------------------------------------ */

let cache: { data: CalendarEvent[]; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getEvents(): Promise<CalendarEvent[]> {
  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }
  const data = await scrapeAllEvents();
  cache = { data, timestamp: now };
  return data;
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Calendar scrape error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
