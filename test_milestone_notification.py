import json
import subprocess
import sys

def test_milestone_notification():
    """Test the milestone notification system with sample data"""
    
    # Sample milestone data for testing
    test_data = {
        "milestone": {
            "id": "rev-1k",
            "category": "revenue",
            "target": 1000,
            "description": "Earned 1,000 Robux",
            "isCompleted": True
        },
        "progress": {
            "revenue_completed": 1,
            "revenue_total": 15,
            "sales_completed": 0,
            "sales_total": 15,
            "items_completed": 0,
            "items_total": 15,
            "total_completed": 1,
            "total_milestones": 45,
            "completion_percentage": 2
        }
    }
    
    # Convert to JSON string
    json_data = json.dumps(test_data)
    
    print("🧪 Testing milestone notification system...")
    print(f"📊 Test milestone: {test_data['milestone']['description']}")
    print(f"🎯 Category: {test_data['milestone']['category']}")
    print(f"🎯 Target: {test_data['milestone']['target']:,}")
    print(f"📈 Progress: {test_data['progress']['total_completed']}/{test_data['progress']['total_milestones']} ({test_data['progress']['completion_percentage']}%)")
    print()
    
    try:
        # Run the milestone notifier script with UTF-8 encoding
        result = subprocess.run([
            'python', 'milestone_notifier.py', json_data
        ], capture_output=True, text=True, encoding='utf-8', timeout=30)
        
        print("📤 Script output:")
        if result.stdout:
            print(result.stdout)
        
        if result.stderr:
            print("⚠️ Script errors:")
            print(result.stderr)
        
        if result.returncode == 0:
            print("✅ Test completed successfully!")
            print("🎉 Check your #milestones Discord channel for the notification!")
        else:
            print(f"❌ Test failed with return code: {result.returncode}")
            
    except subprocess.TimeoutExpired:
        print("⏰ Test timed out after 30 seconds")
    except FileNotFoundError:
        print("❌ Python not found. Make sure Python is installed and in your PATH")
    except Exception as e:
        print(f"❌ Test error: {e}")

if __name__ == "__main__":
    test_milestone_notification()
