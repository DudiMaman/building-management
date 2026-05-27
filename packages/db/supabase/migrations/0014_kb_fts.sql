-- Full-text-search index on kb_chunks.
-- Used by KbService.search() until OpenAI embeddings are wired in. Once
-- they are, the `embedding` column (already exists, vector(1536)) becomes
-- the primary search vector; tsv stays as a fallback for short queries
-- and exact-keyword matches.
--
-- Postgres 'simple' dictionary works fine for Hebrew + English mixed
-- content — no stemming, no stop words, indexes everything verbatim.

alter table kb_chunks add column if not exists tsv tsvector;

create or replace function kb_chunks_tsv_trigger() returns trigger as $$
begin
  new.tsv := to_tsvector('simple', coalesce(new.content, ''));
  return new;
end;
$$ language plpgsql;

drop trigger if exists kb_chunks_tsv_update on kb_chunks;
create trigger kb_chunks_tsv_update
  before insert or update of content on kb_chunks
  for each row execute function kb_chunks_tsv_trigger();

-- Backfill any existing rows
update kb_chunks set tsv = to_tsvector('simple', coalesce(content, ''))
 where tsv is null;

create index if not exists kb_chunks_tsv_idx on kb_chunks using gin(tsv);
