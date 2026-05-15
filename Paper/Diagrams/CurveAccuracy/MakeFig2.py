from PIL import Image, ImageDraw
import os

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))

# Image filenames
image_names = ["PolyDC.png", "PolyHybrid.png", "PolySeiler.png"]
image_paths = [os.path.join(script_dir, name) for name in image_names]

# Display names for labels
display_names = ["de Casteljau", "Hybrid", "Seiler"]

# Load the main image (PolyDC.png) for the left side
main_image = Image.open(image_paths[0])
main_width, main_height = main_image.size

# Load the three images for the right side
right_images = [Image.open(path) for path in image_paths]

# Define the region to zoom into by location (x, y) and size (width, height)
crop_x = 50
crop_y = 375
crop_width = 20
crop_height = 20
crop_box = (crop_x, crop_y, crop_x + crop_width, crop_y + crop_height)

# Define the second zoom region
crop_x2 = 250
crop_y2 = 245
crop_width2 = 20
crop_height2 = 20
crop_box2 = (crop_x2, crop_y2, crop_x2 + crop_width2, crop_y2 + crop_height2)

# Calculate scaling for right images to match main image height
# Now we have 3 columns and 2 rows, so target height = main_height / 2
target_height = main_height / 2

# Organize images in a 3D structure: [image_index][crop_region][scaled_image]
# where image_index = 0,1,2 for PolyDC, PolyHybrid, PolySeiler
# and crop_region = 0,1 for the two zoom regions
inset_images = []
column_widths = []

# Calculate target height for scaled images
new_height = int(target_height)

for img in right_images:
    column_images = []
    
    # First zoom region (red) - on top
    cropped_img = img.crop(crop_box)
    aspect_ratio = cropped_img.width / cropped_img.height
    new_width = int(new_height * aspect_ratio)
    scaled_img = cropped_img.resize((new_width, new_height), Image.Resampling.NEAREST)
    column_images.append(scaled_img)
    
    # Second zoom region (blue) - on bottom
    cropped_img2 = img.crop(crop_box2)
    aspect_ratio2 = cropped_img2.width / cropped_img2.height
    new_width2 = int(new_height * aspect_ratio2)
    scaled_img2 = cropped_img2.resize((new_width2, new_height), Image.Resampling.NEAREST)
    column_images.append(scaled_img2)
    
    inset_images.append(column_images)
    
    # Width of this column is the max width of the two images in the column
    column_width = max(scaled_img.width, scaled_img2.width)
    column_widths.append(column_width)

# Calculate combined image dimensions
combined_width = main_width + sum(column_widths)
combined_height = main_height

# Create the combined image in RGBA mode for transparency support
combined_image = Image.new("RGBA", (combined_width, combined_height), color=(255, 255, 255, 255))

# Paste the main image on the left
main_image_rgba = main_image.convert("RGBA")
combined_image.paste(main_image_rgba, (0, 0))

# Draw the zoom rectangle on the main image in red and blue
draw_main = ImageDraw.Draw(combined_image)
draw_main.rectangle(crop_box, outline="red", width=2)
draw_main.rectangle(crop_box2, outline="blue", width=2)

# Paste the inset images in 3 columns x 2 rows layout
draw_main = ImageDraw.Draw(combined_image)
x_position = main_width

for col_idx, (column_images, col_width) in enumerate(zip(inset_images, column_widths)):
    for row_idx, img in enumerate(column_images):
        y_position = row_idx * int(target_height)
        # Convert to RGBA before pasting
        img_rgba = img.convert("RGBA")
        combined_image.paste(img_rgba, (x_position, y_position), img_rgba)
    
    x_position += col_width

# Add text labels to the top row of inset images
draw = ImageDraw.Draw(combined_image)
font_size = 20
try:
    # Try to use a nice font, fall back to default if not available
    from PIL import ImageFont
    font = ImageFont.truetype("arial.ttf", font_size)
except:
    font = ImageFont.load_default()

x_position = main_width
for col_idx, (column_images, col_width, name) in enumerate(zip(inset_images, column_widths, display_names)):
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
        
        # Draw background for text
        draw.rectangle(
            [(bg_left, bg_top), (bg_right, bg_bottom)],
            fill=(64, 64, 64, 255) 
        )
        draw.text((x_position + 5, text_y), text, fill=text_color, font=font)
    
    x_position += col_width

# Draw borders on top of text
draw_borders = ImageDraw.Draw(combined_image)
x_position = main_width
for col_idx, (column_images, col_width) in enumerate(zip(inset_images, column_widths)):
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

# Save the combined image
output_path = os.path.join(script_dir, "diagram.png")
combined_image_rgb = combined_image.convert("RGB")
combined_image_rgb.save(output_path)
print(f"Diagram saved to {output_path}")
