from typing import Annotated

from nodes import Node
from schemas import Handler, Metadata, Quality


class MockSentiment(Node):
    metadata = Metadata(
        name="Mock Sentiment",
        description="A deterministic toy sentiment classifier for plugin testing.",
        icon="smile",
        color="#f59e0b",
    )

    def execute(
        self,
        text: Annotated[
            str,
            Handler(handle_name="text", handle_type="input", renderer="text"),
        ],
        threshold: Annotated[
            int,
            Handler(
                handle_name="threshold",
                handle_type="menu",
                renderer="number",
                value=1,
                config={"description": "Minimum score difference for positive/negative."},
            ),
        ] = 1,
    ) -> Annotated[
        str,
        Handler(handle_name="sentiment", handle_type="output", renderer="pluginsentimentbadge"),
    ]:
        positive_words = {"good", "great", "excellent", "happy", "useful", "nice", "love", "success"}
        negative_words = {"bad", "broken", "sad", "error", "fail", "problem", "hard", "bug"}

        tokens = {token.strip(".,!?;:()[]{}\"'").lower() for token in text.split()}
        score = len(tokens & positive_words) - len(tokens & negative_words)

        if score >= threshold:
            label = "positive"
        elif score <= -threshold:
            label = "negative"
        else:
            label = "neutral"

        return f"**Sentiment:** {label}\n\nScore: `{score}`"

    def quality(self, node, graph):
        return [
            Quality(
                name="Mock classifier",
                description="This is a deterministic mockup and not a real ML model.",
                function="info",
            )
        ]
