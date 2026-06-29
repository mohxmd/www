# Docker, Unix Sockets & Bun's Unix Fetch — My Notes

> Things I learned and want to remember. Written simply so future-me understands it fast.

---

## What is Docker?

Docker lets you pack your app **plus everything it needs** (Node version, OS libraries, configs) into one box called a **container**. That box runs the same everywhere — your laptop, your friend's machine, a production server.

```
Without Docker → "works on my machine" 😭
With Docker    → works everywhere ✅
```

### Two parts of Docker

When you install Docker, you actually get two things:

| Part | What it is |
|---|---|
| **Docker CLI** | The commands you type — `docker ps`, `docker run` |
| **Docker Daemon** | The background engine that actually does the work |

Think of it like a restaurant. You (CLI) place the order. The kitchen (Daemon) cooks it.

---

## How Does the CLI Talk to the Daemon?

They're both on your machine, so they need a way to communicate.

Docker could have used a network port:
```
CLI → localhost:2375 → Daemon
```

But that's dangerous — **any program on your machine** could send commands to that port and do things like delete all your containers.

So Docker chose a smarter path.

---

## Enter the `.sock` File

Instead of a port, Docker uses a special file:

```
/var/run/docker.sock
```

This is called a **Unix domain socket** — a `.sock` file. It acts as a **pipe** between two programs on the same machine. No network. No IP address. No port. Just a file.

```
CLI → /var/run/docker.sock → Daemon ✅
```

Because it's a plain file, you control it with **normal file permissions** — just like any file on your system. Only users with access to that file can talk to Docker. Security sorted, for free.

### What exactly is a `.sock` file?

A `.sock` file is not a regular file you can open in a text editor. It's a special OS-level file that acts as a **communication endpoint**. Two programs can connect to it and send data back and forth — like a pipe, but smarter.

You'll see `.sock` files everywhere once you know what to look for:

```
/var/run/docker.sock       ← Docker
/var/run/redis/redis.sock  ← Redis
/var/run/php-fpm.sock      ← PHP on Nginx servers
/var/run/bun.sock          ← your own Bun app (if you set it up)
```

---

## How Bun's Unix Fetch Fits In

Here's the key insight: **Docker Daemon speaks HTTP** — just through that `.sock` file instead of a network port.

So you can talk to Docker yourself using a normal `fetch()` call, just pointing it at the socket file:

```ts
// Ask Docker: "what containers are running?"
const res = await fetch("http://localhost/containers/json", {
  unix: "/var/run/docker.sock", // 👈 use the file, not a network port
});

const containers = await res.json();
// [{ Id: "abc123", Image: "nginx", Status: "running" }]
```

You're doing exactly what the Docker CLI does under the hood. You just cut out the middleman.

### The full picture

```
You type: docker ps
     ↓
Docker CLI builds an HTTP request
     ↓
Sends it through /var/run/docker.sock
     ↓
Docker Daemon receives it
     ↓
Sends response back through same file
     ↓
CLI prints the table you see
```

With `fetch + unix`, **your code** replaces the Docker CLI entirely.

---

## Why Use a Socket Instead of a Port? (Quick Recap)

| | Unix Socket (`.sock`) | TCP Port |
|---|---|---|
| Address | `/var/run/app.sock` | `localhost:3000` |
| Works across machines? | ❌ Same machine only | ✅ Yes |
| Speed | ⚡ Faster | Slower |
| Security | Only who has file access | Can be exposed publicly |
| Best for | Internal tools, local services | Public APIs |

---

## Real World: Who Uses This?

- **Docker** — CLI talks to Daemon via `/var/run/docker.sock`. The whole Docker security model is built on this.
- **Redis** — apps on the same server connect via socket instead of port. ~40% faster latency.
- **Nginx + PHP** — Wikipedia switched to socket-based communication between Nginx and PHP, saw ~15% drop in server load.

---

## One-Line Summaries to Remember

> **Docker Daemon** listens on a `.sock` file, not a port — for speed and security.

> **A `.sock` file** is a pipe between two programs on the same machine. No network needed.

> **Bun's `unix` option in fetch** lets you send HTTP requests through a `.sock` file — exactly like the Docker CLI does.
