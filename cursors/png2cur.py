import os
import subprocess
from PIL import Image

FPS = 20
FRAME_DELAY = int(1000 / FPS)  # 50ms


def process_folder():
    files = os.listdir()
    png_files = [f for f in files if f.endswith(".png")]

    if not png_files:
        print("No PNG files found in the current directory.")
        return

    groups = {}
    for file in png_files:
        if "_" in file:
            base = file.rsplit("_", 1)[0]
            groups.setdefault(base, []).append(file)
        else:
            groups.setdefault(file.replace(".png",""), []).append(file)

    for base, frames in groups.items():
        frames.sort()
        print(f"\nProcessing set: {base}")

        config_name = f"{base}.cursorconf"

        with open(config_name, "w") as conf:
            for frame in frames:
                try:
                    img = Image.open(frame)
                    width, height = img.size

                    if width != height:
                        print(f"⚠ {frame} is not square ({width}x{height})")

                    conf.write(f"{width} 0 0 {frame} {FRAME_DELAY}\n")
                except Exception as e:
                    print(f"Error opening {frame}: {e}")

        output_name = base  # Xcursor files usually have no extension
        try:
            result = subprocess.run(
                ["xcursorgen", config_name, output_name],
                capture_output=True,
                text=True
            )

            if result.returncode != 0:
                print(f"ERROR running xcursorgen for {base}:", result.stderr)
            else:
                print(f"Built Xcursor: {output_name}")
        except FileNotFoundError:
            print("ERROR: 'xcursorgen' command not found. Please install it (e.g., x11-apps or xcursor-themes package).")

# Change directory to the script's location to process files there
os.chdir(os.path.dirname(os.path.abspath(__file__)))
process_folder()
print("Execution finished!")