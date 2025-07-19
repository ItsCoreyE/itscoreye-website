import requests
import json
import sys
import os

# Set UTF-8 encoding for Windows compatibility
if os.name == 'nt':  # Windows
    import codecs
    try:
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
    except Exception as e:
        # Fallback if UTF-8 encoding fails
        print(f"Warning: Could not set UTF-8 encoding: {e}")
        
# Ensure UTF-8 encoding is used
os.environ['PYTHONIOENCODING'] = 'utf-8'

class MilestoneNotifier:
    def __init__(self, webhook_url, user_id, username, ping_role_id=None):
        self.webhook_url = webhook_url
        self.user_id = user_id
        self.username = username
        self.ping_role_id = ping_role_id
        
        # Milestone-specific color scheme matching ItsCoreyE branding
        self.milestone_colours = {
            'revenue': 0xFFD700,  # Gold
            'sales': 0x00FF7F,    # Spring Green  
            'items': 0x1E90FF     # Dodger Blue
        }
        
        # Category emojis and display names
        self.category_config = {
            'revenue': {
                'emoji': '💰',
                'name': 'Revenue Milestone',
                'unit': 'Robux',
                'celebration': 'Money milestone achieved!'
            },
            'sales': {
                'emoji': '🛍️',
                'name': 'Sales Milestone',
                'unit': 'Sales',
                'celebration': 'Sales target smashed!'
            },
            'items': {
                'emoji': '🎨',
                'name': 'Item Release Milestone',
                'unit': 'Items',
                'celebration': 'Creation milestone unlocked!'
            }
        }

    def format_number(self, num):
        """Format numbers with appropriate suffixes (K, M, etc.)"""
        if num >= 1000000:
            return f"{num/1000000:.1f}M".rstrip('0').rstrip('.')
        elif num >= 1000:
            return f"{num/1000:.1f}K".rstrip('0').rstrip('.')
        else:
            return str(num)

    def create_milestone_embed(self, milestone_data, progress_stats):
        """Create a rich Discord embed for milestone completion"""
        category = milestone_data.get('category', 'revenue')
        target = milestone_data.get('target', 0)
        description = milestone_data.get('description', 'Milestone achieved!')
        
        config = self.category_config.get(category, self.category_config['revenue'])
        colour = self.milestone_colours.get(category, self.milestone_colours['revenue'])
        
        # Create achievement title
        achievement_title = f"🎉 **{config['name']} Unlocked!**"
        
        # Format target number
        formatted_target = self.format_number(target)
        
        embed = {
            "title": achievement_title,
            "description": f"**{description}**\n\n*{config['celebration']}*",
            "color": colour,
            "fields": [
                {
                    "name": f"{config['emoji']} **Achievement**",
                    "value": f"`{formatted_target} {config['unit']}`",
                    "inline": True
                },
                {
                    "name": "📊 **Category Progress**",
                    "value": f"`{progress_stats.get(f'{category}_completed', 0)}/{progress_stats.get(f'{category}_total', 0)} completed`",
                    "inline": True
                },
                {
                    "name": "🏆 **Overall Progress**",
                    "value": f"`{progress_stats.get('total_completed', 0)}/{progress_stats.get('total_milestones', 0)} milestones ({progress_stats.get('completion_percentage', 0)}%)`",
                    "inline": False
                }
            ],
            "footer": {
                "text": "Milestone Tracker • ItsCoreyE"
            },
            "author": {
                "name": f"ItsCoreyE ({self.user_id})",
                "url": f"https://www.roblox.com/users/{self.user_id}/profile"
            }
        }
        
        return embed

    def post_milestone_to_discord(self, milestone_data, progress_stats):
        """Post milestone completion to Discord"""
        embed = self.create_milestone_embed(milestone_data, progress_stats)
        
        # Create content with role ping
        content = "🎊 **Milestone Reached!**"
        if self.ping_role_id:
            content = f"<@&{self.ping_role_id}> {content}"
        
        payload = {
            "content": content,
            "embeds": [embed]
        }
        
        try:
            response = requests.post(self.webhook_url, json=payload)
            if response.status_code == 204:
                print(f"✅ Posted milestone: {milestone_data.get('description', 'Unknown')}")
                return True
            else:
                print(f"❌ Discord post failed: {response.status_code}")
                print(f"Response: {response.text}")
        except Exception as e:
            print(f"❌ Discord error: {e}")
        return False

    def handle_milestone_webhook(self, milestone_data, progress_stats):
        """Handle incoming milestone completion webhook"""
        print(f"🎯 Processing milestone completion...")
        print(f"📊 Milestone: {milestone_data.get('description', 'Unknown')}")
        print(f"🎯 Category: {milestone_data.get('category', 'Unknown')}")
        print(f"🎯 Target: {milestone_data.get('target', 0)}")
        
        success = self.post_milestone_to_discord(milestone_data, progress_stats)
        
        if success:
            print(f"🎉 Successfully posted milestone to Discord!")
        else:
            print(f"❌ Failed to post milestone to Discord")
        
        return success

def main():
    """Main function to handle command line execution"""
    if len(sys.argv) < 2:
        print("❌ Usage: python milestone_notifier.py <milestone_json>")
        sys.exit(1)
    
    try:
        # Parse milestone data from command line argument
        milestone_json = sys.argv[1]
        data = json.loads(milestone_json)
        
        milestone_data = data.get('milestone', {})
        progress_stats = data.get('progress', {})
        
        # Configuration
        MILESTONE_WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1396159506131718244/sRVMiGR-JmmXNKXcVFeq3x2dLz43NgbYEv-rR_eekftrmKnVxtvJLRyqHKV4WyOV7_Ym"
        USER_ID = "3504185"
        USERNAME = "ItsCoreyE"
        PING_ROLE_ID = "1396163147311616141"
        
        print("🏆 Starting milestone notification...")
        print(f"👤 User: {USERNAME} ({USER_ID})")
        print(f"🔔 Role ping: {PING_ROLE_ID}")
        print("🌐 Milestone webhook configured ✅\n")
        
        # Create and run the milestone notifier
        notifier = MilestoneNotifier(MILESTONE_WEBHOOK_URL, USER_ID, USERNAME, PING_ROLE_ID)
        success = notifier.handle_milestone_webhook(milestone_data, progress_stats)
        
        if success:
            print("✅ Milestone notification completed successfully!")
            sys.exit(0)
        else:
            print("❌ Milestone notification failed!")
            sys.exit(1)
            
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON data: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
