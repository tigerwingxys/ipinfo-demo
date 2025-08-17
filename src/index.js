function printHelloWorld() {
    console.log("hello world");
}
printHelloWorld();
import { McpServer, ResourceTemplate, } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const server = new McpServer({
    name: "echo-server",
    version: "1.0.0",
});
server.registerResource("echo", new ResourceTemplate("echo://{message}", { list: undefined }), {
    title: "Echo Resource",
    description: "Echoes back messages as resources",
}, async (uri, { message }) => ({
    contents: [
        {
            uri: uri.href,
            text: `Resource echo: ${message}`,
        },
    ],
}));
server.registerTool("echo", {
    title: "Echo Tool",
    description: "Echoes back the provided message",
    inputSchema: z.object({ message: z.string() }),
}, async ({ message }) => ({
    content: [{ type: "text", text: `Tool echo: ${message}` }],
}));
server.registerPrompt("echo", {
    title: "Echo Prompt",
    description: "Creates a prompt to process a message",
    argsSchema: { message: z.string() },
}, ({ message }) => ({
    messages: [
        {
            role: "user",
            content: {
                type: "text",
                text: `Please process this message: ${message}`,
            },
        },
    ],
}));
const transport = new StdioServerTransport();
await server.connect(transport);
