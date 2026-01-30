"""Generate a 4x2 grid of squares and save as ZigZag.pdf

This script creates a grid of 4 columns and 2 rows of equal squares
and saves the output as a PDF file named ZigZag.pdf in the same
directory as this script.
"""

from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib.patches as patches


def draw_grid(cols=4, rows=2, square_size=1.0, padding=0.2, out_path=None):
    """Draw a grid of squares and save to a PDF file.

    Args:
        cols (int): Number of columns (default 4).
        rows (int): Number of rows (default 2).
        square_size (float): Side length of each square in plot units.
        padding (float): Padding around the grid (in same units).
        out_path (str or Path): Output PDF file path. If None, uses ZigZag.pdf
    """

    if out_path is None:
        out_path = Path(__file__).with_name("ZigZag.pdf")
    else:
        out_path = Path(out_path)

    width = cols * square_size
    height = rows * square_size

    fig_width = width + 2 * padding
    fig_height = height + 2 * padding

    fig, ax = plt.subplots(figsize=(fig_width * 1.5, fig_height * 1.5))

    # Draw squares and labels
    labels = [['E', 'F', 'G', 'H'], ['A', 'B', 'C', 'D']]  # r=0 bottom, r=1 top
    for r in range(rows):
        for c in range(cols):
            x = c * square_size + padding
            y = r * square_size + padding
            rect = patches.Rectangle((x, y), square_size, square_size,
                                     linewidth=1.5, edgecolor='black', facecolor='none')
            ax.add_patch(rect)
            # place centered label
            label = labels[r][c]
            # choose text color based on grouping
            path_letters = set(['A', 'F', 'C', 'H'])
            other_letters = set(['E', 'B', 'G', 'D'])
            path_color = 'tab:blue'
            other_color = 'tab:green'
            text_color = path_color if label in path_letters else other_color
            ax.text(x + square_size/2, y + square_size/2, label,
                    horizontalalignment='center', verticalalignment='center',
                    fontsize=int(square_size * 24), fontweight='bold', color=text_color, zorder=3)

    # Map labels to cell centers
    centers = {}
    for r in range(rows):
        for c in range(cols):
            label = labels[r][c]
            cx = c * square_size + padding + square_size / 2
            cy = r * square_size + padding + square_size / 2
            centers[label] = (cx, cy)

    # Draw orange arrows A -> F -> C -> H (one arrow per segment) on top of letters
    path = ['A', 'F', 'C', 'H']
    for i in range(len(path) - 1):
        start = centers[path[i]]
        end = centers[path[i + 1]]
        arrow = patches.FancyArrowPatch((start[0], start[1]), (end[0], end[1]),
                                        arrowstyle='-|>', color='orange', linewidth=2.5,
                                        mutation_scale=20, shrinkA=6, shrinkB=6, zorder=5)
        ax.add_patch(arrow)

    # Configure axes
    ax.set_xlim(0, width + 2 * padding)
    ax.set_ylim(0, height + 2 * padding)
    ax.set_aspect('equal')
    ax.axis('off')

    # Save as PDF
    fig.savefig(out_path, bbox_inches='tight')
    plt.close(fig)

    return out_path


if __name__ == '__main__':
    out = draw_grid(cols=4, rows=2)
    print(f"Saved grid PDF to: {out}")
