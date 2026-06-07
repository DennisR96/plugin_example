from typing import Annotated

from nodes import Node
from schemas import Handler, Metadata, Quality


class PromptTemplate(Node):
    metadata = Metadata(
        name="Prompt Template",
        description="Builds a short prompt from a topic, style, and audience.",
        icon="message-square-text",
        color="#7c3aed",
    )

    def execute(
        self,
        topic: Annotated[
            str,
            Handler(
                handle_name="topic",
                handle_type="menu",
                renderer="plugintextinput",
                value="CGNodes plugins",
                config={
                    "description": "What should the prompt be about?",
                    "placeholder": "Example: visual workflow plugins",
                },
            ),
        ],
        style: Annotated[
            str,
            Handler(
                handle_name="style",
                handle_type="menu",
                renderer="plugintextinput",
                value="concise and practical",
                config={
                    "description": "Desired writing style.",
                    "placeholder": "Example: friendly and technical",
                },
            ),
        ] = "concise and practical",
        audience: Annotated[
            str,
            Handler(
                handle_name="audience",
                handle_type="menu",
                renderer="plugintextinput",
                value="software developers",
                config={
                    "description": "Target audience.",
                    "placeholder": "Example: product managers",
                },
            ),
        ] = "software developers",
    ) -> Annotated[
        str,
        Handler(handle_name="prompt", handle_type="output", renderer="markdown"),
    ]:
        return (
            f"Write a {style} explanation about **{topic}** for {audience}.\n\n"
            "Include:\n"
            "- one sentence of context\n"
            "- three bullet points\n"
            "- one practical next step"
        )

    def quality(self, node, graph):
        topic = node.data.inputs.get("topic")
        value = getattr(topic, "value", None) if topic else None
        if not value:
            return [
                Quality(
                    name="Missing topic",
                    description="Set a topic before executing the prompt template.",
                    function="warning",
                )
            ]
        return [
            Quality(
                name="Prompt ready",
                description="The prompt template has enough information to run.",
                function="success",
            )
        ]
