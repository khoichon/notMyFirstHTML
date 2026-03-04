import os
import subprocess
from PIL import Image

FPS = 20
FRAME_DELAY = int(1000 / FPS)  # 50ms


def process_folder():
    files = os.listdir()
    png_files = [f for f in files if f.endswith(".png")]

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
                img = Image.open(frame)
                width, height = img.size

                if width != height:
                    print(f"⚠ {frame} is not square ({width}x{height})")

                conf.write(f"{width} 0 0 {frame} {FRAME_DELAY}\n")

        output_name = base  # Xcursor files usually have no extension
        result = subprocess.run(
            ["xcursorgen", config_name, output_name],
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print("ERROR:", result.stderr)
        else:
            print(f"Built Xcursor: {output_name}")

        print(f"Built Xcursor: {output_name}")


process_folder()
print("it ran!")