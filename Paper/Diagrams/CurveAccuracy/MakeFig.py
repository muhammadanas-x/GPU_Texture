from PIL import Image, ImageDraw
import os

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Image filenames
image_names = ["PolyDC_Cubic_F32.png", "PolyHybrid_Cubic_F32.png", "PolySeiler_Cubic_F32.png"]
image_paths = [os.path.join(script_dir, name) for name in image_names]

# Display names for labels
display_names = ["de Casteljau", "Hybrid", "Seiler"]

# Load the main image (PolyDC.png) for the left side
main_image = Image.open(image_paths[0])
main_width, main_height = main_image.size

# Load the three images for the right side
right_images = [Image.open(path) for path in image_paths]

# Load quintic images for second row
quintic_hybrid_path = os.path.join(script_dir, "PolyHybrid_Quintic_F32.png")
quintic_seiler_path = os.path.join(script_dir, "PolySeiler_Quintic_F32.png")
quintic_hybrid_image = Image.open(quintic_hybrid_path)
quintic_seiler_image = Image.open(quintic_seiler_path)

# Define the region to zoom into for QUADRATIC images (x, y) and size (width, height)
cubic_crop_x = 50
cubic_crop_y = 375
cubic_crop_width = 20
cubic_crop_height = 20
cubic_crop_box = (cubic_crop_x, cubic_crop_y, cubic_crop_x + cubic_crop_width, cubic_crop_y + cubic_crop_height)

# Define the second zoom region for QUADRATIC
cubic_crop_x2 = 250
cubic_crop_y2 = 245
cubic_crop_width2 = 20
cubic_crop_height2 = 20
cubic_crop_box2 = (cubic_crop_x2, cubic_crop_y2, cubic_crop_x2 + cubic_crop_width2, cubic_crop_y2 + cubic_crop_height2)

# Define the region to zoom into for QUINTIC images (x, y) and size (width, height)
quintic_crop_x = 30
quintic_crop_y = 385
quintic_crop_width = 20
quintic_crop_height = 20
quintic_crop_box = (quintic_crop_x, quintic_crop_y, quintic_crop_x + quintic_crop_width, quintic_crop_y + quintic_crop_height)

# Define the second zoom region for QUINTIC
quintic_crop_x2 = 155
quintic_crop_y2 = 245
quintic_crop_width2 = 20
quintic_crop_height2 = 20
quintic_crop_box2 = (quintic_crop_x2, quintic_crop_y2, quintic_crop_x2 + quintic_crop_width2, quintic_crop_y2 + quintic_crop_height2)

# Calculate scaling for right images to match main image height
# Now we have 3 columns and 2 rows, so target height = main_height / 2
target_height = main_height / 2

# Organize images in a 3D structure: [image_index][crop_region][scaled_image]
# where image_index = 0,1,2 for PolyDC, PolyHybrid, PolySeiler
# and crop_region = 0,1 for the two zoom regions
cubic_inset_images = []
cubic_column_widths = []

# Calculate target height for scaled images
new_height = int(target_height)

for img in right_images:
    column_images = []

    # First zoom region (red) - on top
    cropped_img = img.crop(cubic_crop_box)
    aspect_ratio = cropped_img.width / cropped_img.height
    new_width = int(new_height * aspect_ratio)
    scaled_img = cropped_img.resize((new_width, new_height), Image.Resampling.NEAREST)
    column_images.append(scaled_img)

    # Second zoom region (blue) - on bottom
    cropped_img2 = img.crop(cubic_crop_box2)
    aspect_ratio2 = cropped_img2.width / cropped_img2.height
    new_width2 = int(new_height * aspect_ratio2)
    scaled_img2 = cropped_img2.resize((new_width2, new_height), Image.Resampling.NEAREST)
    column_images.append(scaled_img2)

    cubic_inset_images.append(column_images)

    # Width of this column is the max width of the two images in the column
    column_width = max(scaled_img.width, scaled_img2.width)
    cubic_column_widths.append(column_width)

# Process quintic images (only Hybrid and Seiler)
quintic_images = [quintic_hybrid_image, quintic_seiler_image]
quintic_inset_images = []
quintic_column_widths = []
quintic_display_names = ["Hybrid", "Seiler"]

for img in quintic_images:
    column_images = []

    # First zoom region (red) - on top
    cropped_img = img.crop(quintic_crop_box)
    aspect_ratio = cropped_img.width / cropped_img.height
    new_width = int(new_height * aspect_ratio)
    scaled_img = cropped_img.resize((new_width, new_height), Image.Resampling.NEAREST)
    column_images.append(scaled_img)

    # Second zoom region (blue) - on bottom
    cropped_img2 = img.crop(quintic_crop_box2)
    aspect_ratio2 = cropped_img2.width / cropped_img2.height
    new_width2 = int(new_height * aspect_ratio2)
    scaled_img2 = cropped_img2.resize((new_width2, new_height), Image.Resampling.NEAREST)
    column_images.append(scaled_img2)

    quintic_inset_images.append(column_images)

    # Width of this column is the max width of the two images in the column
    column_width = max(scaled_img.width, scaled_img2.width)
    quintic_column_widths.append(column_width)

# Calculate combined image dimensions
# Top row width: cubic main image + zoomed columns
cubic_row_width = main_width + sum(cubic_column_widths)
# Bottom row width: quintic main image + zoomed columns (use hybrid as main)
quintic_main_width = quintic_hybrid_image.width
quintic_row_width = quintic_main_width + sum(quintic_column_widths)
# Combined width is the max of the two rows
combined_width = max(cubic_row_width, quintic_row_width)
# Combined height is cubic row + separator + quintic row
separator_height = 20
combined_height = main_height + separator_height + quintic_hybrid_image.height

# Create the combined image in RGBA mode for transparency support
combined_image = Image.new("RGBA", (combined_width, combined_height), color=(255, 255, 255, 255))

# Load font first (will be reused)
font_size = 20
try:
    from PIL import ImageFont
    font = ImageFont.truetype("arial.ttf", font_size)
except:
    font = ImageFont.load_default()

# === TOP ROW: QUADRATIC ===
# Paste the cubic main image on the left
main_image_rgba = main_image.convert("RGBA")
combined_image.paste(main_image_rgba, (0, 0))

# Draw the zoom rectangles on the cubic main image in red and blue
draw_main = ImageDraw.Draw(combined_image)
draw_main.rectangle(cubic_crop_box, outline="red", width=2)
draw_main.rectangle(cubic_crop_box2, outline="blue", width=2)

# Add label to the cubic main image with transparency
main_label = "de Casteljau - Cubic"
bbox = draw_main.textbbox((0, 0), main_label, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

label_x = 5
label_y = 5
bg_padding = 5

# Create transparent overlay for label background
overlay = Image.new("RGBA", combined_image.size, (0, 0, 0, 0))
overlay_draw = ImageDraw.Draw(overlay)
overlay_draw.rectangle(
    [(label_x - bg_padding, label_y - bg_padding),
     (label_x + text_width + bg_padding, label_y + text_height + bg_padding)],
    fill=(64, 64, 64, 180)
)
combined_image = Image.alpha_composite(combined_image, overlay)

# Draw text on top
draw_main = ImageDraw.Draw(combined_image)
draw_main.text((label_x, label_y), main_label, fill="white", font=font)

# Paste the cubic inset images in 3 columns x 2 rows layout
x_position = main_width

for col_idx, (column_images, col_width) in enumerate(zip(cubic_inset_images, cubic_column_widths)):
    for row_idx, img in enumerate(column_images):
        y_position = row_idx * int(target_height)
        # Convert to RGBA before pasting
        img_rgba = img.convert("RGBA")
        combined_image.paste(img_rgba, (x_position, y_position), img_rgba)

    x_position += col_width

# Add text labels to the top row of cubic inset images
draw = ImageDraw.Draw(combined_image)

x_position = main_width
for col_idx, (column_images, col_width, name) in enumerate(zip(cubic_inset_images, cubic_column_widths, display_names)):
    # Only show labels for the top row (row_idx == 0)
    if len(column_images) > 0:
        img = column_images[0]
        y_position = 0

        # Add text at the top of each image
        text_color = "white"
        text = name
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        # Position text at the top of the image
        text_y = y_position + 5

        # Draw semi-transparent background for text
        bg_padding = 5
        bg_left = x_position + 5 - bg_padding
        bg_top = text_y - bg_padding
        bg_right = x_position + text_width + 5 + bg_padding
        bg_bottom = text_y + text_height + bg_padding

        # Draw background for text with transparency
        overlay = Image.new("RGBA", combined_image.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rectangle(
            [(bg_left, bg_top), (bg_right, bg_bottom)],
            fill=(64, 64, 64, 180)
        )
        combined_image = Image.alpha_composite(combined_image, overlay)

        # Draw text on top
        draw = ImageDraw.Draw(combined_image)
        draw.text((x_position + 5, text_y), text, fill=text_color, font=font)

    x_position += col_width

# Draw borders on top of text for cubic insets
draw_borders = ImageDraw.Draw(combined_image)
x_position = main_width
for col_idx, (column_images, col_width) in enumerate(zip(cubic_inset_images, cubic_column_widths)):
    for row_idx, img in enumerate(column_images):
        y_position = row_idx * int(target_height)
        # Draw border with appropriate color (red for row 0, blue for row 1)
        border_color = "red" if row_idx == 0 else "blue"
        draw_borders.rectangle(
            [(x_position, y_position), (x_position + img.width - 1, y_position + img.height - 1)],
            outline=border_color,
            width=2
        )
    x_position += col_width

# === BOTTOM ROW: QUINTIC ===
# The separator_height gap is already built into combined_height
second_row_y = main_height + separator_height

# Paste the quintic main image (use Hybrid as main)
quintic_main_rgba = quintic_hybrid_image.convert("RGBA")
combined_image.paste(quintic_main_rgba, (0, second_row_y))

# Draw the zoom rectangles on the quintic main image
draw_quintic = ImageDraw.Draw(combined_image)
quintic_main_crop_box = (quintic_crop_x, second_row_y + quintic_crop_y, quintic_crop_x + quintic_crop_width, second_row_y + quintic_crop_y + quintic_crop_height)
quintic_main_crop_box2 = (quintic_crop_x2, second_row_y + quintic_crop_y2, quintic_crop_x2 + quintic_crop_width2, second_row_y + quintic_crop_y2 + quintic_crop_height2)
draw_quintic.rectangle(quintic_main_crop_box, outline="red", width=2)
draw_quintic.rectangle(quintic_main_crop_box2, outline="blue", width=2)

# Add label to the quintic main image
quintic_main_label = "Hybrid - Quintic"
bbox = draw_quintic.textbbox((0, 0), quintic_main_label, font=font)
text_width = bbox[2] - bbox[0]
text_height = bbox[3] - bbox[1]

label_x = 5
label_y = second_row_y + 5

# Create transparent overlay for quintic label background
overlay = Image.new("RGBA", combined_image.size, (0, 0, 0, 0))
overlay_draw = ImageDraw.Draw(overlay)
overlay_draw.rectangle(
    [(label_x - bg_padding, label_y - bg_padding),
     (label_x + text_width + bg_padding, label_y + text_height + bg_padding)],
    fill=(64, 64, 64, 180)
)
combined_image = Image.alpha_composite(combined_image, overlay)

# Draw text on top
draw_quintic = ImageDraw.Draw(combined_image)
draw_quintic.text((label_x, label_y), quintic_main_label, fill="white", font=font)

# Paste the quintic inset images in 2 columns x 2 rows layout
x_position = quintic_main_width

for col_idx, (column_images, col_width) in enumerate(zip(quintic_inset_images, quintic_column_widths)):
    for row_idx, img in enumerate(column_images):
        y_position = second_row_y + row_idx * int(target_height)
        # Convert to RGBA before pasting
        img_rgba = img.convert("RGBA")
        combined_image.paste(img_rgba, (x_position, y_position), img_rgba)

    x_position += col_width

# Add text labels to the top row of quintic inset images
x_position = quintic_main_width
for col_idx, (column_images, col_width, name) in enumerate(zip(quintic_inset_images, quintic_column_widths, quintic_display_names)):
    if len(column_images) > 0:
        img = column_images[0]
        y_position = second_row_y

        text_color = "white"
        text = name
        bbox = draw_quintic.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        text_y = y_position + 5

        bg_left = x_position + 5 - bg_padding
        bg_top = text_y - bg_padding
        bg_right = x_position + text_width + 5 + bg_padding
        bg_bottom = text_y + text_height + bg_padding

        # Draw background for text with transparency
        overlay = Image.new("RGBA", combined_image.size, (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.rectangle(
            [(bg_left, bg_top), (bg_right, bg_bottom)],
            fill=(64, 64, 64, 180)
        )
        combined_image = Image.alpha_composite(combined_image, overlay)

        # Draw text on top
        draw_quintic = ImageDraw.Draw(combined_image)
        draw_quintic.text((x_position + 5, text_y), text, fill=text_color, font=font)

    x_position += col_width

# Draw borders on quintic insets
x_position = quintic_main_width
for col_idx, (column_images, col_width) in enumerate(zip(quintic_inset_images, quintic_column_widths)):
    for row_idx, img in enumerate(column_images):
        y_position = second_row_y + row_idx * int(target_height)
        border_color = "red" if row_idx == 0 else "blue"
        draw_quintic.rectangle(
            [(x_position, y_position), (x_position + img.width - 1, y_position + img.height - 1)],
            outline=border_color,
            width=2
        )
    x_position += col_width

# Save the combined image
output_path = os.path.join(script_dir, "diagram.png")
combined_image_rgb = combined_image.convert("RGB")
combined_image_rgb.save(output_path)
print(f"Diagram saved to {output_path}")
