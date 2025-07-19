from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

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
                return True, f"Posted milestone: {milestone_data.get('description', 'Unknown')}"
            else:
                return False, f"Discord post failed: {response.status_code} - {response.text}"
        except Exception as e:
            return False, f"Discord error: {e}"

@app.route('/milestone-webhook', methods=['POST'])
def milestone_webhook():
    """Handle incoming milestone completion webhook from Vercel"""
    try:
        data = request.get_json()
        
        if not data or 'milestone' not in data or 'progress' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing milestone or progress data'
            }), 400
        
        milestone_data = data['milestone']
        progress_stats = data['progress']
        
        # Configuration
        MILESTONE_WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1396159506131718244/sRVMiGR-JmmXNKXcVFeq3x2dLz43NgbYEv-rR_eekftrmKnVxtvJLRyqHKV4WyOV7_Ym"
        USER_ID = "3504185"
        USERNAME = "ItsCoreyE"
        PING_ROLE_ID = "1396163147311616141"
        
        # Create and run the milestone notifier
        notifier = MilestoneNotifier(MILESTONE_WEBHOOK_URL, USER_ID, USERNAME, PING_ROLE_ID)
        success, message = notifier.post_milestone_to_discord(milestone_data, progress_stats)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Milestone notification sent to Discord',
                'milestone': milestone_data.get('description', 'Unknown'),
                'category': milestone_data.get('category', 'Unknown')
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to send Discord notification',
                'details': message,
                'milestone': milestone_data.get('description', 'Unknown')
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'milestone-notifier',
        'version': '1.0.0'
    })

@app.route('/', methods=['GET'])
def home():
    """Home endpoint with service info"""
    return jsonify({
        'service': 'ItsCoreyE Milestone Notifier',
        'version': '1.0.0',
        'endpoints': {
            '/milestone-webhook': 'POST - Send milestone notifications',
            '/health': 'GET - Health check'
        }
    })

if __name__ == '__main__':
    # For local testing
    app.run(debug=True, host='0.0.0.0', port=5000)
