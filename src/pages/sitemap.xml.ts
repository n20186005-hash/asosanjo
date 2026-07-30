import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
export const prerender = true;
const pages = ['', 'status/', 'access/', 'guide/', 'food/', 'plan/', 'faq/', 'privacy/'];
export const GET: APIRoute = () => {
  const urls = pages.map((path) => `<url><loc>${new URL(`/${path}`, SITE.url)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
