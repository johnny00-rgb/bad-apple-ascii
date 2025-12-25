import os
import json
import subprocess

def process_frames(frames_dir, output_json, width=120):
    ascii_frames_data = []
    frames = sorted([f for f in os.listdir(frames_dir) if f.startswith('frame_') and f.endswith('.png')])

    for i, frame_file in enumerate(frames):
        image_path = os.path.join(frames_dir, frame_file)
        temp_ascii_file = f"temp_ascii_{i:04d}.txt"
        
        # Call image_to_ascii.py as a subprocess
        command = ["python", "image_to_ascii.py", image_path, temp_ascii_file, str(width)]
        
        try:
            subprocess.run(command, check=True, capture_output=True, text=True)
            with open(temp_ascii_file, "r") as f:
                ascii_data = f.read()
            ascii_frames_data.append(ascii_data)
            os.remove(temp_ascii_file) # Clean up temporary file
        except subprocess.CalledProcessError as e:
            print(f"Error processing frame {frame_file}: {e}")
            print(f"Stdout: {e.stdout}")
            print(f"Stderr: {e.stderr}")
            if os.path.exists(temp_ascii_file):
                os.remove(temp_ascii_file)
            continue
        except FileNotFoundError:
            print(f"Error: image_to_ascii.py not found. Make sure it's in the same directory.")
            return

        print(f"Processed frame {i+1}/{len(frames)}")

    with open(output_json, "w") as f:
        json.dump(ascii_frames_data, f)
    print(f"All ASCII frames saved to {output_json}")

if __name__ == "__main__":
    frames_directory = "frames"
    output_file = "ascii_frames.json"
    process_frames(frames_directory, output_file, width=120)
