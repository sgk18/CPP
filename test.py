import csv
from datetime import datetime, timedelta

# Configuration
START_DATE = datetime.now().date() # Starts today, or change to specific date like datetime(2025, 1, 1).date()
DURATION_MONTHS = 12
START_TIME = "06:00 AM"
END_TIME = "07:45 AM"

# The Master Workout Routine (A/B Split)
workouts = {
    0: { # Monday
        "Subject": "Day 1: PUSH A (Chest Focus)",
        "Description": "1. Bench Press (4x8-10)\n2. Incline DB Press (3x10-12)\n3. Incline Flys (3x12-15)\n4. Lateral Raises (4x15)\n5. Tricep Pushdowns (3x12-15)\nFinisher: Cable Crossovers or Incline Push-ups"
    },
    1: { # Tuesday
        "Subject": "Day 2: PULL A (Width Focus)",
        "Description": "1. Pull-ups (4xAMRAP)\n2. Lat Pulldowns (3x10-12)\n3. Single-Arm Rows (3x12/arm)\n4. Face Pulls (4x15-20)\n5. DB Curls (4x10-12)\nFinisher: Straight-Arm Pulldowns"
    },
    2: { # Wednesday
        "Subject": "Day 3: LEGS A (Squat Focus)",
        "Description": "1. Barbell Squats (4x8-10)\n2. Leg Press (4x10-12)\n3. Leg Extensions (3x15)\n4. Walking Lunges (3x12/leg)\n5. Plank (3x60s)\nFinisher: Calf Raises or Goblet Squats"
    },
    3: { # Thursday
        "Subject": "Day 4: PUSH B (Shoulder Focus)",
        "Description": "1. Overhead Press (4x8-10)\n2. Arnold Press (3x10-12)\n3. Close-Grip Bench (3x8-10)\n4. Weighted Dips (3x10-12)\n5. Skullcrushers (3x12)\nFinisher: Lateral Raise Drop Set"
    },
    4: { # Friday
        "Subject": "Day 5: PULL B (Thickness Focus)",
        "Description": "1. Deadlifts (3x5)\n2. T-Bar Rows (4x10-12)\n3. Seated Cable Rows (3x12)\n4. Reverse Pec Deck (4x15)\n5. Hammer Curls (4x12)\nFinisher: Shrugs or Farmers Walk"
    },
    5: { # Saturday
        "Subject": "Day 6: LEGS B (Agility Focus)",
        "Description": "1. RDLs (4x10-12)\n2. Bulgarian Split Squats (3x10/leg)\n3. Leg Curls (4x12-15)\n4. Lying Leg Raises (3x15)\n5. Russian Twists (3x20)\nFinisher: Death by Leg Press or Sprints"
    },
    6: { # Sunday
        "Subject": "Day 7: RECOVERY",
        "Description": "1. Foam Roll (15 mins)\n2. Mobility Circuit (Glute Bridge, Cat-Cow, Deep Squat Hold)\n3. Deep Static Stretching (20 mins)"
    }
}

def generate_csv():
    filename = "surya_hero_schedule.csv"
    headers = ["Subject", "Start Date", "Start Time", "End Date", "End Time", "Description", "Location"]
    
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        
        current_date = START_DATE
        end_date = START_DATE + timedelta(days=365) # 12 Months roughly
        
        while current_date <= end_date:
            weekday = current_date.weekday() # 0=Mon, 6=Sun
            
            # Get workout for the day
            workout = workouts.get(weekday)
            
            if workout:
                row = [
                    workout["Subject"],
                    current_date.strftime("%Y-%m-%d"),
                    START_TIME,
                    current_date.strftime("%Y-%m-%d"),
                    END_TIME,
                    workout["Description"],
                    "Gym / Hostel"
                ]
                writer.writerow(row)
            
            current_date += timedelta(days=1)
            
    print(f"Successfully generated {filename}. You can now import this into Google Calendar.")

if __name__ == "__main__":
    generate_csv()