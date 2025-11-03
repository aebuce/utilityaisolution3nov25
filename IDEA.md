# utilityaisolution3nov25

# Purpose
Build a Static Webpage based on React that will be used to postion a Facility Management work Order Management Solution in pre-sales stage
We only need the slide content for presenting the solution. We DO NOT need to build the actual AI solution.
The Web page should be easy to demonstrate being able to move between slides using keyboard right and left keys and also let the presenter highlight content using a virtual laser highlighter

# Background
The solution is meant to be based on the folowing components
1) Amazon Connect for Managing PSTN Voice, Web Chat and Web Voice Channels
2) Amazon Lex for Conversational AI
3) Amazon Bedrock Knowledgebase to enable Lex to handle FAQ & Q&A questions
4) Amazon Bedrock Agents to handle Agentic AI to connect with multiple backends 
5) Backends consist of multiple CMMS and Field Dispatch systems serving more than 80 customers and properties
6) The Conversational AI also needs to followup with Field Service Partners to confirm receipt of work order and update on status


## Slide 1 - Opening slide
Introductory Slide with tile, Presenter and Date

## Slide 2 - Introduction
Business Process overview of the solution based on mermaid swimlane explaining how the call will be handled step by step

## Slide 3 - Technical Solution
AWS Architecture Diagram showing the architecture and demonstrating step by step how the call flows in each step of the work order process 

## Slide 3 - Implementation Plan
Approach Project plan based on Mermaid Gantt showing the project plan

## Slide 4 - Consumption Estimate 
Estimate the cost of this solution and illustrate with a chart on how the cost works out over a 60 month timeline. Make the Slide Interactive with the cost changing based on monthly Call Volumes that can be changed using a slider.

## Slide 5 - thanks
Thank You Slide with The Key Highlight of the Solutions scrolled in background


# Solution Specifics
1) Build a simple reactJS solution using bun
2) Keep the solution as simple as possible and no testing needed