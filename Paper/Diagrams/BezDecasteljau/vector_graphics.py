import matplotlib.pyplot as plt
import numpy as np

fig, (ax_left, ax_right) = plt.subplots(1, 2, figsize=(16, 8))

P0 = np.array([0, 0])
P1 = np.array([0.5, 1])
P2 = np.array([1, 0])
t = 0.6

Q01 = (1 - t) * P0 + t * P1
Q12 = (1 - t) * P1 + t * P2
R012 = (1 - t) * Q01 + t * Q12

t_values = np.linspace(0, 1, 100)

curve = np.array([
    (1 - s) ** 2 * P0
    + 2 * (1 - s) * s * P1
    + s ** 2 * P2
    for s in t_values
])

# =========================
# LEFT DIAGRAM
# =========================

rect_left = plt.Rectangle(
    (-0.15, -0.025),
    1.3,
    1.15,
    fill=False,
    color="black",
    lw=1.5,
    transform=ax_left.transData,
    clip_on=False
)
ax_left.add_patch(rect_left)

# Bézier curve
ax_left.plot(
    curve[:, 0],
    curve[:, 1],
    color="blue",
    lw=4
)

# Control polygon A -> B
ax_left.annotate(
    "",
    xy=P1,
    xytext=P0,
    arrowprops=dict(
        arrowstyle="-|>",
        color="red",
        lw=1.5,
        mutation_scale=30
    )
)

# Control polygon B -> C
ax_left.annotate(
    "",
    xy=P2,
    xytext=P1,
    arrowprops=dict(
        arrowstyle="-|>",
        color="limegreen",
        lw=1.5,
        mutation_scale=30
    )
)

# Interpolated segment AB -> BC
ax_left.annotate(
    "",
    xy=Q12,
    xytext=Q01,
    arrowprops=dict(
        arrowstyle="-|>",
        color="orange",
        lw=1.5,
        mutation_scale=30
    )
)

# Interpolated points
ax_left.plot(
    Q01[0],
    Q01[1],
    "o",
    color="red",
    markersize=12
)

ax_left.plot(
    Q12[0],
    Q12[1],
    "o",
    color="limegreen",
    markersize=12
)

ax_left.plot(
    R012[0],
    R012[1],
    "ko",
    markersize=15
)

# Point labels
ax_left.text(
    P0[0] - 0.05,
    P0[1],
    r"$A$",
    fontsize=26,
    ha="right"
)

ax_left.text(
    P1[0],
    P1[1] + 0.05,
    r"$B$",
    fontsize=26,
    ha="center"
)

ax_left.text(
    P2[0] + 0.05,
    P2[1],
    r"$C$",
    fontsize=26,
    ha="left"
)

ax_left.text(
    Q01[0] - 0.05,
    Q01[1],
    r"$AB$",
    color="red",
    fontsize=26,
    ha="right"
)

ax_left.text(
    Q12[0] + 0.05,
    Q12[1],
    r"$BC$",
    color="limegreen",
    fontsize=26,
    ha="left"
)

ax_left.text(
    R012[0],
    R012[1] - 0.1,
    r"$ABC$",
    color="orange",
    fontsize=26,
    ha="center"
)

# Bold italic t with spaces around equals sign
ax_left.text(
    -0.1,
    0.58,
    r"$\boldsymbol{t} = 0.6$",
    fontsize=20
)

ax_left.set_xlim(-0.2, 1.2)
ax_left.set_ylim(-0.1, 1.2)
ax_left.set_aspect("equal")
ax_left.axis("off")

# =========================
# RIGHT DIAGRAM
# =========================

# Outer square
ax_right.plot(
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    color="black",
    lw=1.5
)

# Horizontal AB direction
ax_right.annotate(
    "",
    xy=(1, 0.1),
    xytext=(0, 0.1),
    arrowprops=dict(
        arrowstyle="-|>",
        color="red",
        lw=1,
        mutation_scale=40
    )
)

ax_right.text(
    0.6,
    0.03,
    r"$AB$",
    color="red",
    fontsize=24,
    ha="center"
)

# Horizontal BC direction
ax_right.annotate(
    "",
    xy=(1, 0.9),
    xytext=(0, 0.9),
    arrowprops=dict(
        arrowstyle="-|>",
        color="limegreen",
        lw=1,
        mutation_scale=40
    )
)

ax_right.text(
    0.6,
    0.93,
    r"$BC$",
    color="limegreen",
    fontsize=24,
    ha="center"
)

# Vertical interpolation AB -> BC
ax_right.annotate(
    "",
    xy=(0.6, 0.9),
    xytext=(0.6, 0.1),
    arrowprops=dict(
        arrowstyle="-|>",
        color="orange",
        lw=1,
        mutation_scale=40
    )
)

ax_right.text(
    0.65,
    0.6,
    r"$ABC$",
    color="orange",
    fontsize=24
)

# Diagonal texture-sampling path
ax_right.plot(
    [0, 1],
    [0, 1],
    color="blue",
    lw=4
)

# Sample points
ax_right.plot(
    0.6,
    0.1,
    "o",
    color="red",
    markersize=10
)

ax_right.plot(
    0.6,
    0.9,
    "o",
    color="limegreen",
    markersize=10
)

ax_right.plot(
    0.6,
    0.6,
    "ko",
    markersize=12
)

# Bold italic coordinate variables with spaces around equals sign
ax_right.text(
    0.05,
    0.53,
    r"$\boldsymbol{(u,\,v)} = (0.6,\,0.6)$",
    fontsize=20
)

# Corner labels
ax_right.text(
    -0.05,
    -0.05,
    r"$A$",
    fontsize=24
)

ax_right.text(
    1.02,
    -0.05,
    r"$B$",
    fontsize=24
)

ax_right.text(
    -0.05,
    1.05,
    r"$B$",
    fontsize=24
)

ax_right.text(
    1.02,
    1.05,
    r"$C$",
    fontsize=24
)

ax_right.set_xlim(-0.1, 1.1)
ax_right.set_ylim(-0.1, 1.1)
ax_right.set_aspect("equal")
ax_right.axis("off")

plt.tight_layout()

plt.savefig(
    "swapped_bezier_combined.pdf",
    format="pdf",
    bbox_inches="tight"
)

plt.show()