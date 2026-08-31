
"""
Personal Daily Habit, Coding & Video Editing Tracker
Built with Streamlit - Single-File Web Application
"""

import streamlit as st
import json
import os
from datetime import datetime, date, timedelta
import pandas as pd
import altair as alt

# ==============================================================================
# 1. CORE DATA SCHEMAS & DEFAULT HABITS
# ==============================================================================

DATA_FILE = os.path.join(os.path.dirname(__file__), "progress_data.json")

DEFAULT_HABITS = [
    {
        "id": "coding_session",
        "name": "Daily Coding Session",
        "category": "Coding",
        "icon": "💻",
        "description": "Built features, solved bugs, or worked on personal projects"
    },
    {
        "id": "dsa_practice",
        "name": "DSA Concepts & Practice",
        "category": "DSA",
        "icon": "🧠",
        "description": "Practiced LeetCode, trees/graphs/DP, or algorithmic problem solving"
    },
    {
        "id": "college_work",
        "name": "College Coursework & Assignments",
        "category": "College",
        "icon": "📚",
        "description": "Reviewed lectures, completed lab exercises, or prepared submissions"
    },
    {
        "id": "video_editing",
        "name": "Video Editing Practice",
        "category": "Video Editing",
        "icon": "🎬",
        "description": "Practiced Premiere/After Effects cuts, pacing, motion graphics or grading"
    }
]

# ==============================================================================
# 2. LOCAL DATA PERSISTENCE LAYER
# ==============================================================================

def load_data() -> dict:
    """Load tracking data from local JSON file or return initial schema."""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if "days" not in data:
                    data["days"] = {}
                if "custom_habits" not in data:
                    data["custom_habits"] = []
                return data
        except Exception as e:
            st.error(f"Error loading data file: {e}")
            return {"days": {}, "custom_habits": []}
    return {"days": {}, "custom_habits": []}

def save_data(data: dict):
    """Save data to local JSON file safely."""
    try:
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        st.error(f"Failed to save data: {e}")

def get_day_entry(data: dict, date_str: str) -> dict:
    """Get or initialize a record for a specific date."""
    if date_str not in data["days"]:
        data["days"][date_str] = {
            "habits": {},
            "reflection": "",
            "hours": {"coding": 0.0, "dsa": 0.0, "college": 0.0, "video": 0.0},
            "tags": [],
            "updated_at": datetime.now().isoformat()
        }
    return data["days"][date_str]

# ==============================================================================
# 3. STREAK & METRIC CALCULATION ENGINE
# ==============================================================================

def calculate_metrics(data: dict, current_date_obj: date):
    """
    Calculate current streak, longest streak, total active days,
    and completion statistics.
    """
    days = data.get("days", {})
    if not days:
        return {
            "current_streak": 0,
            "longest_streak": 0,
            "total_active_days": 0,
            "overall_completion_rate": 0,
            "today_completion_rate": 0,
            "today_completed_count": 0,
            "total_habits_count": len(DEFAULT_HABITS),
            "total_hours": 0.0
        }

    # An active day is defined as having at least 1 habit completed or a non-empty reflection or hours logged
    active_dates = set()
    total_completed_habits = 0
    total_possible_habits = 0
    total_hours_spent = 0.0

    all_habits_list = DEFAULT_HABITS + data.get("custom_habits", [])
    num_habits = max(len(all_habits_list), 1)

    for d_str, entry in days.items():
        habits = entry.get("habits", {})
        completed_count = sum(1 for v in habits.values() if v is True)
        reflection = entry.get("reflection", "").strip()
        hours = entry.get("hours", {})
        
        day_hours = sum(float(h) for h in hours.values() if isinstance(h, (int, float)))
        total_hours_spent += day_hours

        if completed_count > 0 or len(reflection) > 0 or day_hours > 0:
            try:
                d_obj = datetime.strptime(d_str, "%Y-%m-%d").date()
                active_dates.add(d_obj)
            except ValueError:
                pass

        if completed_count > 0:
            total_completed_habits += completed_count
            total_possible_habits += num_habits

    total_active_days = len(active_dates)

    # Calculate Current Streak:
    # If today is active, count backwards from today.
    # If today is not active yet, count backwards from yesterday (grace period for current day).
    current_streak = 0
    test_date = current_date_obj
    
    if test_date in active_dates:
        while test_date in active_dates:
            current_streak += 1
            test_date -= timedelta(days=1)
    else:
        test_date = current_date_obj - timedelta(days=1)
        while test_date in active_dates:
            current_streak += 1
            test_date -= timedelta(days=1)

    # Calculate Longest Streak in all recorded history
    longest_streak = 0
    if active_dates:
        sorted_dates = sorted(list(active_dates))
        temp_streak = 1
        longest_streak = 1
        for i in range(1, len(sorted_dates)):
            if sorted_dates[i] == sorted_dates[i-1] + timedelta(days=1):
                temp_streak += 1
                if temp_streak > longest_streak:
                    longest_streak = temp_streak
            else:
                temp_streak = 1

    # Overall completion rate
    overall_rate = 0
    if total_possible_habits > 0:
        overall_rate = round((total_completed_habits / total_possible_habits) * 100)

    # Today's completion rate
    today_str = current_date_obj.strftime("%Y-%m-%d")
    today_entry = days.get(today_str, {})
    today_habits = today_entry.get("habits", {})
    today_completed = sum(1 for v in today_habits.values() if v is True)
    today_rate = round((today_completed / num_habits) * 100) if num_habits > 0 else 0

    return {
        "current_streak": current_streak,
        "longest_streak": longest_streak,
        "total_active_days": total_active_days,
        "overall_completion_rate": overall_rate,
        "today_completion_rate": today_rate,
        "today_completed_count": today_completed,
        "total_habits_count": num_habits,
        "total_hours": round(total_hours_spent, 1)
    }

# ==============================================================================
# 4. SAMPLE SEED DATA GENERATOR (FOR QUICK DEMO/TESTING)
# ==============================================================================

def seed_demo_data(data: dict, current_date_obj: date):
    """Populates a realistic 14-day history for instant preview."""
    import random
    sample_notes = [
        "Implemented graph BFS/DFS traversals in Python. Solidified tree recursion intuition.",
        "Built responsive navbar and dark theme toggles. Practiced CSS grid and flexbox.",
        "Color graded a cinematic vlog sequence in Premiere Pro. Mastered Lumetri curves.",
        "Completed Operating Systems homework on virtual memory & paging. Cleaned up repo.",
        "Solved 3 Medium LeetCode problems (Two Pointers & Sliding Window). Feeling confident!",
        "Edited 60s fast-paced YouTube Short with sound effects, keyframes, and motion text.",
        "Database normalization assignment submitted. Practiced SQL joins and indexing.",
        "Designed UI mockups and refactored backend API endpoints with async handlers."
    ]
    
    tags_pool = ["#Coding", "#DSA", "#College", "#VideoEditing", "#Consistency", "#ProblemSolved"]

    for i in range(14, -1, -1):
        day_date = current_date_obj - timedelta(days=i)
        day_str = day_date.strftime("%Y-%m-%d")
        
        # 85% probability of active day
        if random.random() < 0.9 or i == 0:
            habits = {
                "coding_session": random.choice([True, True, True, False]),
                "dsa_practice": random.choice([True, True, False, True]),
                "college_work": random.choice([True, False, True, True]),
                "video_editing": random.choice([True, True, False, False])
            }
            hours = {
                "coding": round(random.uniform(1.0, 3.5), 1) if habits["coding_session"] else 0.0,
                "dsa": round(random.uniform(0.5, 2.0), 1) if habits["dsa_practice"] else 0.0,
                "college": round(random.uniform(1.0, 2.5), 1) if habits["college_work"] else 0.0,
                "video": round(random.uniform(1.0, 3.0), 1) if habits["video_editing"] else 0.0
            }
            reflection = sample_notes[i % len(sample_notes)]
            selected_tags = random.sample(tags_pool, k=random.randint(1, 3))

            data["days"][day_str] = {
                "habits": habits,
                "reflection": reflection,
                "hours": hours,
                "tags": selected_tags,
                "updated_at": datetime.now().isoformat()
            }
    save_data(data)

# ==============================================================================
# 5. STREAMLIT UI & INTERACTIVE APPLICATION
# ==============================================================================

def main():
    # Modern CSS Styling
    custom_css = """
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

        html, body, [class*="css"] {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        code, pre, .mono {
            font-family: 'JetBrains Mono', monospace !important;
        }

        .block-container {
            max-width: 1060px;
            padding-top: 1.8rem;
            padding-bottom: 4rem;
        }

        .hero-banner {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 24px 30px;
            margin-bottom: 24px;
            backdrop-filter: blur(16px);
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .hero-title {
            font-size: 2.2rem;
            font-weight: 800;
            background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 6px;
            letter-spacing: -0.02em;
        }

        .hero-subtitle {
            color: #94a3b8;
            font-size: 1.05rem;
            font-weight: 400;
            margin: 0;
        }

        .metric-card {
            background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.7) 100%);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .metric-card:hover {
            transform: translateY(-3px);
            border-color: rgba(96, 165, 250, 0.3);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
        }

        .metric-icon {
            font-size: 1.8rem;
            margin-bottom: 8px;
            display: inline-block;
        }

        .metric-value {
            font-size: 2.1rem;
            font-weight: 800;
            color: #f8fafc;
            line-height: 1.1;
            letter-spacing: -0.02em;
        }

        .metric-label {
            font-size: 0.82rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #94a3b8;
            margin-top: 6px;
        }

        .metric-sub {
            font-size: 0.76rem;
            color: #38bdf8;
            margin-top: 4px;
            font-weight: 500;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.25rem;
            font-weight: 700;
            color: #f1f5f9;
            margin-top: 10px;
            margin-bottom: 16px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .tag-badge {
            display: inline-block;
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.3);
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 6px;
            margin-bottom: 6px;
        }

        .streak-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.4);
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 700;
        }

        .reflection-entry {
            background: rgba(15, 23, 42, 0.6);
            border-left: 4px solid #3b82f6;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 0 14px 14px 0;
            padding: 16px 20px;
            margin-bottom: 14px;
            transition: transform 0.2s ease;
        }

        .reflection-entry:hover {
            transform: translateX(4px);
            background: rgba(30, 41, 59, 0.7);
        }

        .reflection-date {
            color: #38bdf8;
            font-weight: 700;
            font-size: 0.95rem;
        }

        .reflection-text {
            color: #cbd5e1;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-top: 6px;
            margin-bottom: 10px;
            white-space: pre-wrap;
        }
    </style>
    """
    st.markdown(custom_css, unsafe_allow_html=True)

    # Load persistent data
    app_data = load_data()
    today_obj = date.today()

    # Sidebar Navigation & Custom Habit Configuration
    with st.sidebar:
        st.markdown("### ⚙️ **Tracker Settings**")
        
        selected_date_obj = st.date_input(
            "📅 **Select Active Date**",
            value=today_obj,
            max_value=today_obj + timedelta(days=365),
            help="Check in for today or navigate to review/backfill past dates"
        )
        selected_date_str = selected_date_obj.strftime("%Y-%m-%d")
        is_today = (selected_date_obj == today_obj)

        st.markdown("---")
        st.markdown("### ➕ **Custom Daily Goals**")
        
        with st.expander("Add New Goal", expanded=False):
            new_habit_name = st.text_input("Goal Title", placeholder="e.g. Read 15 mins")
            new_habit_icon = st.selectbox("Icon", ["📖", "🏃", "🧘", "🎨", "🚀", "💡", "✍️", "🎧"])
            new_habit_desc = st.text_input("Short Description", placeholder="e.g. Read tech blog or book")
            
            if st.button("Add to Daily Checklist", use_container_width=True):
                if new_habit_name.strip():
                    new_id = "custom_" + "".join(c if c.isalnum() else "_" for c in new_habit_name.lower())
                    existing_ids = [h["id"] for h in DEFAULT_HABITS + app_data.get("custom_habits", [])]
                    if new_id in existing_ids:
                        st.warning("A goal with a similar name already exists.")
                    else:
                        app_data.setdefault("custom_habits", []).append({
                            "id": new_id,
                            "name": new_habit_name.strip(),
                            "category": "Custom",
                            "icon": new_habit_icon,
                            "description": new_habit_desc.strip() or "Custom personal daily goal"
                        })
                        save_data(app_data)
                        st.success(f"Added '{new_habit_name}'!")
                        st.rerun()

        st.markdown("---")
        st.markdown("### 💾 **Data & Backup**")
        
        # Export JSON
        json_export = json.dumps(app_data, indent=2)
        st.download_button(
            label="📥 Download Data (JSON)",
            data=json_export,
            file_name=f"progress_tracker_{datetime.now().strftime('%Y%m%d')}.json",
            mime="application/json",
            use_container_width=True
        )

        # Demo Seed Data Button
        if st.button("✨ Load 14-Day Demo Activity", use_container_width=True, help="Populate sample logs to test analytics"):
            seed_demo_data(app_data, today_obj)
            st.success("Loaded 14 days of demo data!")
            st.rerun()

        if st.button("🗑️ Reset All Data", use_container_width=True, type="secondary"):
            if st.checkbox("Confirm Reset All Records"):
                app_data = {"days": {}, "custom_habits": []}
                save_data(app_data)
                st.warning("All data reset successfully!")
                st.rerun()

    # Calculate metrics & get active day entry
    metrics = calculate_metrics(app_data, today_obj)
    active_day_entry = get_day_entry(app_data, selected_date_str)
    all_habits = DEFAULT_HABITS + app_data.get("custom_habits", [])

    # ==============================================================================
    # HEADER & HERO STATS SECTION
    # ==============================================================================
    date_formatted = selected_date_obj.strftime("%A, %B %d, %Y")
    date_badge = "🔥 TODAY'S CHECK-IN" if is_today else f"📆 VIEWING: {date_formatted}"

    st.markdown(f"""
    <div class="hero-banner">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
            <div>
                <div class="hero-title">Progress Pulse</div>
                <p class="hero-subtitle">Personal Daily Tracker for Coding, DSA & Video Editing Consistency</p>
            </div>
            <div>
                <span class="streak-badge">{date_badge}</span>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

    # 4-Column Hero Metric Cards
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        streak_flame = "🔥" if metrics["current_streak"] > 0 else "❄️"
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">{streak_flame}</div>
            <div class="metric-value">{metrics["current_streak"]} <span style="font-size: 1.1rem; color: #94a3b8;">days</span></div>
            <div class="metric-label">Current Streak</div>
            <div class="metric-sub">{"Active streak!" if metrics["current_streak"] > 0 else "Check in today to start!"}</div>
        </div>
        """, unsafe_allow_html=True)

    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">🏆</div>
            <div class="metric-value">{metrics["longest_streak"]} <span style="font-size: 1.1rem; color: #94a3b8;">days</span></div>
            <div class="metric-label">Best Streak</div>
            <div class="metric-sub">Personal All-Time Record</div>
        </div>
        """, unsafe_allow_html=True)

    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">📅</div>
            <div class="metric-value">{metrics["total_active_days"]}</div>
            <div class="metric-label">Active Days Logged</div>
            <div class="metric-sub">{metrics["total_hours"]} Total Hours Logged</div>
        </div>
        """, unsafe_allow_html=True)

    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-icon">🎯</div>
            <div class="metric-value">{metrics["overall_completion_rate"]}%</div>
            <div class="metric-label">Completion Rate</div>
            <div class="metric-sub">Across All Logged Habits</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("<div style='height: 14px;'></div>", unsafe_allow_html=True)

    # ==============================================================================
    # SECTION 1: DAILY CHECKLIST & INTERACTIVE GOALS
    # ==============================================================================
    current_day_habits = active_day_entry.get("habits", {})
    completed_today_count = sum(1 for h in all_habits if current_day_habits.get(h["id"], False))
    total_available_habits = len(all_habits)
    pct_complete = int((completed_today_count / total_available_habits) * 100) if total_available_habits > 0 else 0

    st.markdown("""
    <div class="section-header">
        <span>✅</span> Daily Habit Checklist
    </div>
    """, unsafe_allow_html=True)

    # Progress Bar Header
    prog_col1, prog_col2 = st.columns([3, 1])
    with prog_col1:
        st.progress(pct_complete / 100.0)
    with prog_col2:
        st.markdown(f"<div style='text-align: right; font-weight: 700; color: #60a5fa; font-size: 1.05rem;'>{completed_today_count}/{total_available_habits} Done ({pct_complete}%)</div>", unsafe_allow_html=True)

    if pct_complete == 100 and total_available_habits > 0:
        st.success("🎉 Outstanding! You've crushed all your daily goals for this date!")
        if is_today and f"celebrated_{today_obj}" not in st.session_state:
            st.balloons()
            st.session_state[f"celebrated_{today_obj}"] = True

    # Interactive Checkboxes
    cols = st.columns(2)
    changed = False

    for idx, habit in enumerate(all_habits):
        col_idx = idx % 2
        with cols[col_idx]:
            is_checked = current_day_habits.get(habit["id"], False)
            
            check_val = st.checkbox(
                f"**{habit['icon']} {habit['name']}**",
                value=is_checked,
                key=f"check_{selected_date_str}_{habit['id']}",
                help=habit["description"]
            )
            st.caption(habit["description"])
            
            if check_val != is_checked:
                active_day_entry["habits"][habit["id"]] = check_val
                active_day_entry["updated_at"] = datetime.now().isoformat()
                changed = True

    if changed:
        save_data(app_data)
        st.rerun()

    st.markdown("<div style='height: 18px;'></div>", unsafe_allow_html=True)

    # ==============================================================================
    # SECTION 2: PROGRESS LOG & DAILY REFLECTION
    # ==============================================================================
    st.markdown("""
    <div class="section-header">
        <span>📝</span> Daily Reflection & Learning Journal
    </div>
    """, unsafe_allow_html=True)

    with st.form(key=f"reflection_form_{selected_date_str}"):
        st.markdown("**What did you accomplish, learn, or solve today?**")
        
        current_reflection_text = active_day_entry.get("reflection", "")
        reflection_input = st.text_area(
            label="Daily Reflection",
            value=current_reflection_text,
            placeholder="e.g. Solved LeetCode 206 (Reverse Linked List) using iterative pointers. Created the title animation in Premiere Pro for the college project video.",
            height=110,
            label_visibility="collapsed"
        )

        st.markdown("**Hours Invested & Category Tags**")
        time_col1, time_col2, time_col3, time_col4 = st.columns(4)
        
        current_hours = active_day_entry.get("hours", {})
        
        with time_col1:
            coding_hrs = st.number_input("💻 Coding (hrs)", min_value=0.0, max_value=24.0, value=float(current_hours.get("coding", 0.0)), step=0.5)
        with time_col2:
            dsa_hrs = st.number_input("🧠 DSA (hrs)", min_value=0.0, max_value=24.0, value=float(current_hours.get("dsa", 0.0)), step=0.5)
        with time_col3:
            college_hrs = st.number_input("📚 College (hrs)", min_value=0.0, max_value=24.0, value=float(current_hours.get("college", 0.0)), step=0.5)
        with time_col4:
            video_hrs = st.number_input("🎬 Video Editing (hrs)", min_value=0.0, max_value=24.0, value=float(current_hours.get("video", 0.0)), step=0.5)

        available_tags = ["#Coding", "#DSA", "#College", "#VideoEditing", "#Algorithms", "#ProjectMilestone", "#BugFixed", "#ExamPrep"]
        current_tags = active_day_entry.get("tags", [])
        
        selected_tags = st.multiselect(
            "🏷️ **Tags for Today**",
            options=available_tags,
            default=[t for t in current_tags if t in available_tags]
        )

        btn_col1, btn_col2 = st.columns([1, 4])
        with btn_col1:
            submit_log = st.form_submit_button("💾 Save Reflection", type="primary", use_container_width=True)

        if submit_log:
            active_day_entry["reflection"] = reflection_input.strip()
            active_day_entry["hours"] = {
                "coding": float(coding_hrs),
                "dsa": float(dsa_hrs),
                "college": float(college_hrs),
                "video": float(video_hrs)
            }
            active_day_entry["tags"] = selected_tags
            active_day_entry["updated_at"] = datetime.now().isoformat()
            
            save_data(app_data)
            st.success("✨ Daily reflection and hours saved successfully!")
            st.rerun()

    st.markdown("<div style='height: 18px;'></div>", unsafe_allow_html=True)

    # ==============================================================================
    # SECTION 3: VISUAL SUMMARY & CONSISTENCY ANALYTICS
    # ==============================================================================
    st.markdown("""
    <div class="section-header">
        <span>📊</span> Weekly Consistency & Activity Breakdown
    </div>
    """, unsafe_allow_html=True)

    # 7-Day Week Strip
    start_of_week = today_obj - timedelta(days=today_obj.weekday())
    week_cols = st.columns(7)
    weekday_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    for i in range(7):
        day_i = start_of_week + timedelta(days=i)
        day_str_i = day_i.strftime("%Y-%m-%d")
        is_curr_sel = (day_i == selected_date_obj)
        
        entry_i = app_data.get("days", {}).get(day_str_i, {})
        habits_i = entry_i.get("habits", {})
        completed_i = sum(1 for v in habits_i.values() if v is True)
        
        status_icon = "⚪"
        status_label = "No entry"
        badge_style = "border: 1px solid rgba(255,255,255,0.08); background: rgba(15, 23, 42, 0.4);"
        
        if completed_i == total_available_habits and total_available_habits > 0:
            status_icon = "🟢"
            status_label = f"{completed_i}/{total_available_habits}"
            badge_style = "border: 1px solid #10b981; background: rgba(16, 185, 129, 0.15);"
        elif completed_i > 0:
            status_icon = "🟡"
            status_label = f"{completed_i}/{total_available_habits}"
            badge_style = "border: 1px solid #f59e0b; background: rgba(245, 158, 11, 0.15);"
        elif day_i > today_obj:
            status_icon = "⏳"
            status_label = "Upcoming"

        if is_curr_sel:
            badge_style += " box-shadow: 0 0 10px rgba(96, 165, 250, 0.5); border-color: #60a5fa;"

        with week_cols[i]:
            st.markdown(f"""
            <div style="text-align: center; padding: 10px 4px; border-radius: 12px; {badge_style}">
                <div style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">{weekday_names[i]}</div>
                <div style="font-size: 1.05rem; font-weight: 700; color: #f8fafc; margin: 2px 0;">{day_i.strftime('%d')}</div>
                <div style="font-size: 0.85rem;">{status_icon}</div>
                <div style="font-size: 0.72rem; color: #cbd5e1; margin-top: 2px;">{status_label}</div>
            </div>
            """, unsafe_allow_html=True)

    st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

    # 14-Day Activity Charts
    chart_col1, chart_col2 = st.columns(2)

    # Build Dataframe for past 14 days
    past_14_days = [today_obj - timedelta(days=d) for d in range(13, -1, -1)]
    chart_records = []
    category_hours = {"Coding": 0.0, "DSA": 0.0, "College": 0.0, "Video Editing": 0.0}

    for d in past_14_days:
        d_str = d.strftime("%Y-%m-%d")
        ent = app_data.get("days", {}).get(d_str, {})
        habs = ent.get("habits", {})
        hrs = ent.get("hours", {})
        
        comp_cnt = sum(1 for v in habs.values() if v is True)
        tot_hrs = sum(float(v) for v in hrs.values() if isinstance(v, (int, float)))
        
        category_hours["Coding"] += float(hrs.get("coding", 0.0))
        category_hours["DSA"] += float(hrs.get("dsa", 0.0))
        category_hours["College"] += float(hrs.get("college", 0.0))
        category_hours["Video Editing"] += float(hrs.get("video", 0.0))

        chart_records.append({
            "Date": d.strftime("%b %d"),
            "Completed Habits": comp_cnt,
            "Total Hours": tot_hrs
        })

    df_chart = pd.DataFrame(chart_records)

    with chart_col1:
        st.markdown("##### 📈 14-Day Habit Completion Trend")
        if not df_chart.empty and df_chart["Completed Habits"].sum() > 0:
            bar_chart = alt.Chart(df_chart).mark_bar(
                cornerRadiusTopLeft=6,
                cornerRadiusTopRight=6,
                color="#3b82f6"
            ).encode(
                x=alt.X("Date:N", sort=None, axis=alt.Axis(labelAngle=-45, title=None)),
                y=alt.Y("Completed Habits:Q", axis=alt.Axis(title="Habits Completed", tickMinStep=1)),
                tooltip=["Date", "Completed Habits", "Total Hours"]
            ).properties(height=220)
            st.altair_chart(bar_chart, use_container_width=True)
        else:
            st.info("No activity recorded in the last 14 days. Complete habits or click 'Load Demo Activity' in the sidebar.")

    with chart_col2:
        st.markdown("##### ⏱️ Total Hours Logged by Domain")
        df_hours = pd.DataFrame([
            {"Category": k, "Hours": round(v, 1)} for k, v in category_hours.items()
        ])
        
        if df_hours["Hours"].sum() > 0:
            hours_chart = alt.Chart(df_hours).mark_bar(
                cornerRadiusTopLeft=6,
                cornerRadiusTopRight=6
            ).encode(
                x=alt.X("Category:N", axis=alt.Axis(labelAngle=0, title=None)),
                y=alt.Y("Hours:Q", axis=alt.Axis(title="Hours")),
                color=alt.Color("Category:N", scale=alt.Scale(
                    domain=["Coding", "DSA", "College", "Video Editing"],
                    range=["#60a5fa", "#a78bfa", "#34d399", "#f472b6"]
                ), legend=None),
                tooltip=["Category", "Hours"]
            ).properties(height=220)
            st.altair_chart(hours_chart, use_container_width=True)
        else:
            st.info("Log hours in your daily reflections to see your domain distribution here.")

    st.markdown("<div style='height: 18px;'></div>", unsafe_allow_html=True)

    # ==============================================================================
    # SECTION 4: PERSISTENT HISTORY LOG & REFLECTION FEED
    # ==============================================================================
    st.markdown("""
    <div class="section-header">
        <span>📖</span> Persistent History Log
    </div>
    """, unsafe_allow_html=True)

    f_col1, f_col2 = st.columns([2, 1])
    with f_col1:
        search_query = st.text_input("🔍 Search reflections & notes", placeholder="Type keywords like 'LeetCode', 'Premiere', 'bug'...")
    with f_col2:
        filter_tag = st.selectbox("Filter by Tag", options=["All Tags"] + available_tags)

    all_day_keys = sorted(list(app_data.get("days", {}).keys()), reverse=True)
    matched_entries = []

    for k in all_day_keys:
        day_val = app_data["days"][k]
        ref_txt = day_val.get("reflection", "")
        day_tags = day_val.get("tags", [])
        
        tag_match = (filter_tag == "All Tags" or filter_tag in day_tags)
        search_match = (not search_query.strip() or search_query.lower() in ref_txt.lower() or any(search_query.lower() in t.lower() for t in day_tags))
        
        if tag_match and search_match:
            matched_entries.append((k, day_val))

    if matched_entries:
        for d_str, d_val in matched_entries:
            try:
                d_parsed = datetime.strptime(d_str, "%Y-%m-%d").strftime("%A, %B %d, %Y")
            except ValueError:
                d_parsed = d_str
                
            habs = d_val.get("habits", {})
            comp_count = sum(1 for v in habs.values() if v is True)
            refl = d_val.get("reflection", "No written reflection.")
            tags = d_val.get("tags", [])
            hrs = d_val.get("hours", {})
            hrs_text = " • ".join([f"{k.capitalize()}: {v}h" for k, v in hrs.items() if v > 0]) or "0 hrs logged"

            tags_html = "".join([f"<span class='tag-badge'>{t}</span>" for t in tags])

            st.markdown(f"""
            <div class="reflection-entry">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="reflection-date">🗓️ {d_parsed}</div>
                    <span class="tag-badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">
                        ✅ {comp_count} habits completed
                    </span>
                </div>
                <div style="font-size: 0.82rem; color: #94a3b8; margin-bottom: 8px;">⏱️ {hrs_text}</div>
                <div class="reflection-text">{refl if refl else '<em style="color:#64748b;">No reflection recorded for this day.</em>'}</div>
                <div>{tags_html}</div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No reflection entries found matching the filter criteria. Start logging reflections above to build your timeline!")

    # Footer
    st.markdown("""
    <div style="text-align: center; color: #64748b; font-size: 0.85rem; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05);">
        ⚡ <strong>Progress Pulse</strong> — Daily Habit, Coding & Video Editing Tracker • Built with Streamlit
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
