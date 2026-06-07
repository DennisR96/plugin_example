from typing import Annotated

from nodes import Node
from schemas import Handler, Metadata, Quality


class TextStats(Node):
    metadata = Metadata(
        name="Text Stats",
        description="Counts characters, words, and lines in a text value.",
        icon="list-ordered",
        color="#0f766e",
    )

    def execute(
        self,
        text: Annotated[
            str,
            Handler(handle_name="text", handle_type="input", renderer="text"),
        ],
    ) -> Annotated[
        dict,
        Handler(handle_name="stats", handle_type="output", renderer="pluginstatscard"),
    ]:
        words = [word for word in text.split() if word]
        lines = text.splitlines() or ([text] if text else [])

        return {
            "characters": len(text),
            "words": len(words),
            "lines": len(lines),
            "preview": text[:120],
        }

    def quality(self, node, graph):
        text_input = node.data.inputs.get("text")
        value = getattr(text_input, "value", None) if text_input else None
        if value in (None, ""):
            return [
                Quality(
                    name="No text connected",
                    description="Connect a text-producing node or provide text before running this node.",
                    function="info",
                )
            ]
        return [Quality(name="Text available", description="Input text is present.", function="success")]
