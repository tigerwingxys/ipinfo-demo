// Run with: npx tsx src/examples/server/toolWithSampleServer.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const mcpServer = new McpServer({
  name: "ipinfo-demo",
  version: "1.0.0",
});

// Tool that uses LLM sampling to summarize any text
mcpServer.registerTool(
  "ipinfo",
  {
    description: "Get IP information",
    inputSchema: { text: z.string().describe("ip address") },
  },
  async ({ text }) => {

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            ip: text,
            hostname: "example.com",
            city: "Example City",
            region: "Example Region",
            country: "EX",
            loc: "00.0000, 00.0000",
            postal: "12345",
            org: "Example from nodejs",
            timezone: "Example/Timezone",
          }),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await mcpServer.connect(transport);