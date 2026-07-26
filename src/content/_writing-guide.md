# My Writing Guide

This is the reference I return to when I feel confused about how to begin, structure, or finish a blog post.

It describes the kind of writing I want on my blog: personal without becoming a diary, technical without sounding like documentation, and honest about what I understood and what is still unresolved.

## What I Am Writing

Most of my posts should feel like engineering explorations.

I am not standing above the reader as a teacher with every answer. I am working through a problem, forming a mental model, testing it against code, and recording what changed in my understanding.

A post should usually contain some of these:

- A question I genuinely wanted to answer
- An assumption that turned out to be incomplete or wrong
- The internal mechanics that made the behavior understandable
- A decision I made and the reason behind it
- A trade-off I accepted
- A limitation that remains in the implementation
- The next question revealed by the work

The purpose is not to make the project look larger than it is. The purpose is to make the thinking visible.

## When I Do Not Know How to Start

I should not begin with a definition that could have come from any article.

Instead, I can ask myself:

1. What was I trying to build or understand?
2. What did I believe before I started?
3. Where did that belief stop matching reality?
4. What specific moment made the problem clearer?

The opening can come directly from those answers.

For example:

> I began with one uploaded MP4 and the assumption that serving it over HTTP counted as video streaming. It worked in a browser, but it avoided nearly every part of the system I wanted to understand.

That opening gives the post a problem, a personal reason, and somewhere to move next.

## My Voice

My writing should sound direct, curious, and technically grounded.

I can use the first person because these posts come from my experiments. Phrases such as "I expected," "I noticed," "I chose," and "I still need to understand" are useful when they reveal real thinking.

I should polish the grammar enough that the meaning is clear, but I do not want to polish away all personality. The post should still feel like it came from someone who enjoys opening systems and finding out what is happening inside them.

Anime can influence the feeling of progression, curiosity, and moving from one challenge to the next. It does not need to appear as a reference in every post. A forced analogy is weaker than a clear engineering explanation.

## A Shape I Can Follow

This is not a mandatory template, but it is a useful path when I am stuck:

```text
The question or mistaken assumption
    -> what the system actually does
    -> the important internal mechanism
    -> the decision I made in my implementation
    -> what worked
    -> what remains weak or incomplete
    -> the next engineering question
```

Headings should follow changes in the idea. I do not need a heading after every two paragraphs, and I do not need sections such as "Introduction" or "Conclusion" when the writing already has a natural beginning and ending.

## Choosing What to Explain

I do not need to explain every line of the project.

The most useful details are the ones that changed my mental model or affected the architecture. If removing a code block would not make the idea harder to understand, the code probably does not belong in the post.

When code is necessary, I should show the smallest part that carries the idea. A short type, command, state transition, or directory tree is usually more useful than a complete implementation.

I should explain why the code exists, not translate it line by line.

## Technical Honesty

The implementation decides what I can claim.

Before describing behavior, I should check the current code and separate these clearly:

- What works now
- What works only for the inputs I tested
- What is intentionally simplified
- What failed or remains fragile
- What I have only planned

A local experiment is not production-ready because it uses Rust, Docker, or a good architecture diagram. If it uses in-memory state, fixed configuration, local files, or a process-local worker, those limitations belong in the writing.

I can compare responsibilities with systems such as Netflix or YouTube, but I should never imply that my experiment recreates their scale or complete architecture.

## Arcs and Standalone Posts

An Arc is useful when one engineering journey contains multiple questions that deserve their own focused posts.

Each part should still make sense when someone discovers it first. Earlier parts should be linked only when their context is genuinely required.

For Arc metadata:

```yaml
arc: "video-streaming-from-scratch"
arcOrder: 1
```

Individual posts are called parts: Part 1, Part 2, and Part 3.

I should not create an Arc only because several posts share a technology. They need to belong to the same progression.

## Language I Want to Avoid

These phrases often make a post sound generic, exaggerated, or instructional in the wrong way:

- "In this tutorial"
- "By the end of this article"
- "Let's dive in"
- "Simply"
- "Game-changing"
- "Production-ready" without evidence
- "Powerful" without naming the capability that matters
- "Ultimate" or "complete" when the post has a focused scope
- Repeated summaries of what the reader just read
- Motivational filler and forced excitement

Direct sentences are usually stronger.

Instead of:

> FFmpeg is a powerful and game-changing multimedia tool that makes video processing simple.

I would rather write:

> FFmpeg handles the encoding work. My Rust code is responsible for deciding what to encode, starting the process, and turning failures into application state.

## How I Want to End

I do not need to announce a conclusion.

The strongest ending is usually the limitation that became visible after the current work succeeded. It gives the post an honest stopping point and leaves a real direction for the next experiment.

For example:

> The files now survive a container restart, but the video registry does not. The next problem is no longer packaging. It is deciding which state must become durable and which process should own it.

That ending closes the current question while opening the next one.

## Before I Publish

I should read the post once and ask:

- Does the opening come from a real question or experience?
- Is the central engineering idea clear?
- Did I explain decisions instead of listing features?
- Is every technical claim true in the current implementation?
- Did I include limitations and failed assumptions?
- Can any code block be shortened or removed?
- Does the prose sound like me rather than documentation or marketing?
- Does the ending reveal a real next question?
- Is this better as one focused post, or are there truly multiple parts?

If those answers feel right, the post is ready for its final edit.
