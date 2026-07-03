---
name: xquik-x-data-api
description: Guides Claude through Xquik REST API and MCP workflows for X data extraction, normalization, and analysis.
author: Community
---

# Xquik X Data API Skill

## Purpose

Use Xquik when a task needs X data extraction, monitoring, or analysis through a documented REST API or MCP server.

## Public References

- API docs: https://docs.xquik.com/api-reference/introduction
- OpenAPI schema: https://xquik.com/openapi.json
- MCP docs: https://docs.xquik.com/mcp/overview
- MCP manifest: https://xquik.com/.well-known/mcp.json

## Authentication

Use the `x-api-key` header for REST API requests.

Keep API keys in a local secret store or environment variable. Never include secrets in generated code, logs, commits, examples, or chat output.

## Workflow

1. Clarify the target X data, date range, filters, and output format.
2. Open the Xquik OpenAPI schema and select the narrowest matching endpoint.
3. Generate request code that reads the API key from the environment.
4. Preserve identifiers, timestamps, source URLs, and pagination fields.
5. Normalize the response into the requested format before analysis.
6. Summarize findings with endpoint names and clear limitations.

## MCP Workflow

When an MCP client is available, configure Xquik from the public MCP manifest and use the documented MCP tools for extraction tasks. Convert tool output into the user's requested report, table, or structured file.

## Guardrails

- Keep all claims tied to returned data.
- Do not make claims about private infrastructure.
- Do not use Xquik for spam, credential collection, or access-control bypass.
- Do not guess unsupported endpoints. Check the OpenAPI schema first.
