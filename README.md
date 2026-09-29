# PhageDB — Complete Bacteriophage Repository

A full rebuild of the existing dark-neon PhageDB concept, expanded into a detailed scientific repository with a public landing page, searchable database, detailed phage profiles, contribution workflow, curation, sharing, comparison and repository resources.

## What is included

- Public landing page inspired by the supplied GTU repository reference, while preserving the existing PhageDB visual language.
- Searchable/filterable phage database.
- Detailed scientific profile with 21 major sections:
  1. Identity
  2. Isolation information
  3. Host information
  4. Taxonomic classification
  5. Morphology
  6. Plaque characteristics
  7. Biological characteristics
  8. Growth parameters + growth curve
  9. Host range
  10. Temperature stability
  11. pH stability
  12. Genome information
  13. Genome annotation
  14. Functional proteins
  15. Laboratory information
  16. SOPs / protocols
  17. Images
  18. Downloads
  19. Applications
  20. Publications
  21. Repository metadata
- QR sharing and direct links.
- Citation copy tool.
- JSON / CSV / FASTA downloads.
- Print / Save-as-PDF profile support.
- Up-to-three-phage comparison.
- Multi-step add/edit form.
- Draft → Pending Review → Verified / Rejected curation workflow.
- Active researcher, curator and administrator accounts with enforced permissions.
- Record completeness indicator.
- Audit trail and version increment on edits.
- Public / embargoed / private visibility field.
- Resource, publications and contact pages.
- Contact-form persistence.
- Production-oriented Supabase/Postgres schema in `docs/supabase-schema.sql`.

## Repository accounts

- Researcher account ID: `GTU-RES-001`
- Curator account ID: `GTU-CUR-001`
- Administrator account ID: `GTU-ADM-001`

Passwords are issued separately and stored only as salted scrypt hashes in the repository data. The login accepts either an account ID or the account's institutional email.

## Local setup

```bash
npm install
npm run dev
```

- Frontend: Vite dev server (normally `http://localhost:5173`)
- API: `http://localhost:8787/api`

Build for production:

```bash
npm run build
npm start
```

The Express server will serve the generated `dist/` directory when present.

## Backend used in this package

The runnable package uses a small JSON-file persistence layer (`server/data.json`) created automatically on first start. This keeps the project easy to inspect and run without database configuration.

For a real university/public repository, use PostgreSQL/Supabase (or another managed relational DB) and object storage. The included `docs/supabase-schema.sql` provides a production-oriented starting point.

## Important production changes before real launch

1. Connect the existing role-based login to institutional SSO / Supabase Auth / Auth0 when GTU identity-provider access is available.
2. Store FASTA, FASTQ, GBK, images and SOPs in object storage, not JSON.
3. Validate taxonomy, host names, genome types and culture collection identifiers using controlled vocabularies.
4. Add checksums, file versions and immutable accession identifiers.
5. Define curator approval rules and evidence requirements for the Verified badge.
6. Add ORCID contributor identities and DOI / PubMed linking.
7. Add rate-limited public API keys and API documentation.
8. Add backups, retention, audit export and repository governance policies.
9. Add accessibility review and institutional privacy / terms / licensing pages.
10. Replace all example data and placeholder institutional contacts with approved real records.

## Recommended next scientific features

- BLAST / genomic similarity search.
- Phylogenetic tree generation.
- Comparative genome viewer.
- Host-range matrix explorer across phages.
- Geographic isolation map.
- Sequence QC and duplicate-sequence detection.
- Automated lifestyle prediction integrations.
- Virulence / AMR gene screening pipeline.
- Cocktail compatibility workspace.
- Lab inventory barcode / QR sample tracking.
- DOI-ready data releases and dataset snapshots.
- Embargo expiry and collaborator-only records.
- Record-level discussion / curator comments.
- Bulk import/export and API-based ingestion.

## Notes

The supplied screenshots were used as visual and information-architecture references. Scientific sample records must be curator-validated before they are treated as authoritative repository data.
