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

class CSVStatsNotifier:
    def __init__(self, webhook_url, user_id, username, ping_role_id=None):
        self.webhook_url = webhook_url
        self.user_id = user_id
        self.username = username
        self.ping_role_id = ping_role_id
        
        # CSV stats color scheme
        self.stats_color = 0x4169E1  # Royal Blue

    def format_number(self, num):
        """Format numbers with appropriate suffixes (K, M, etc.)"""
        if num >= 1000000:
            return f"{num/1000000:.1f}M".rstrip('0').rstrip('.')
        elif num >= 1000:
            return f"{num/1000:.1f}K".rstrip('0').rstrip('.')
        else:
            return str(num)

    def create_csv_stats_embed(self, stats_data):
        """Create a rich Discord embed for CSV stats upload"""
        upload_type = stats_data.get('uploadType', 'single')
        
        # Determine title based on upload type
        data_period = stats_data.get('dataPeriod', 'Current Period')
        
        if upload_type == 'growth':
            title = f"📈 **{data_period} Monthly Stats!**"
            description = f"**New sales data processed with growth analysis**\n\n*Month-over-month comparison calculated*"
        else:
            title = f"📊 **{data_period} Monthly Stats!**"
            description = f"**Fresh sales analytics uploaded**\n\n*Latest ROBLOX sales data processed*"
        
        # Format numbers
        revenue = self.format_number(stats_data.get('totalRevenue', 0))
        sales = self.format_number(stats_data.get('totalSales', 0))
        growth = stats_data.get('growthPercentage', 0)
        
        # Growth formatting
        growth_display = f"+{growth}%" if growth > 0 else f"{growth}%"
        if growth > 0:
            growth_emoji = "📈"
        elif growth < 0:
            growth_emoji = "📉"
        else:
            growth_emoji = "➡️"
        
        # Top items summary
        top_items = stats_data.get('topItems', [])
        top_items_text = "No items data"
        if top_items:
            top_item = top_items[0]
            top_items_text = f"{top_item.get('name', 'Unknown')} ({top_item.get('sales', 0)} sales)"
            if len(top_items) > 1:
                top_items_text += f" + {len(top_items) - 1} more"
        
        embed = {
            "title": title,
            "description": description,
            "color": self.stats_color,
            "fields": [
                {
                    "name": "💰 **Total Revenue**",
                    "value": f"`{revenue} Robux`",
                    "inline": True
                },
                {
                    "name": "🛍️ **Total Sales**",
                    "value": f"`{sales} sales`",
                    "inline": True
                },
                {
                    "name": f"{growth_emoji} **Growth**",
                    "value": f"`{growth_display}`",
                    "inline": True
                },
                {
                    "name": "📅 **Data Period**",
                    "value": f"`{stats_data.get('dataPeriod', 'Unknown')}`",
                    "inline": True
                },
                {
                    "name": "🎨 **Top Item**",
                    "value": f"`{top_items_text}`",
                    "inline": True
                },
                {
                    "name": "🕒 **Updated**",
                    "value": f"`{stats_data.get('lastUpdated', 'Just now')}`",
                    "inline": True
                }
            ],
            "footer": {
                "text": "CSV Stats Tracker • ItsCoreyE"
            },
            "author": {
                "name": f"ItsCoreyE ({self.user_id})",
                "url": f"https://www.roblox.com/users/{self.user_id}/profile"
            }
        }
        
        return embed

    def post_csv_stats_to_discord(self, stats_data):
        """Post CSV stats to Discord"""
        embed = self.create_csv_stats_embed(stats_data)
        
        # Create content with role ping
        data_period = stats_data.get('dataPeriod', 'Current Period')
        upload_type = stats_data.get('uploadType', 'single')
        if upload_type == 'growth':
            content = f"📈 **{data_period} Monthly Stats!**"
        else:
            content = f"📊 **{data_period} Monthly Stats!**"
            
        if self.ping_role_id:
            content = f"<@&{self.ping_role_id}> {content}"
        
        payload = {
            "content": content,
            "embeds": [embed]
        }
        
        try:
            response = requests.post(self.webhook_url, json=payload)
            if response.status_code == 204:
                return True, f"Posted CSV stats: {stats_data.get('dataPeriod', 'Unknown period')}"
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

@app.route('/csv-stats-webhook', methods=['POST'])
def csv_stats_webhook():
    """Handle incoming CSV stats webhook from Vercel"""
    try:
        data = request.get_json()
        
        if not data or 'statsData' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing stats data'
            }), 400
        
        stats_data = data['statsData']
        
        # Configuration for CSV stats webhook
        CSV_STATS_WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1399742825960046632/HUMERyHgiRWhv3DdXQuqYlGwU_3_Z-lP5Lc0ld9N15E7AAZAfo2xDswYDUfrD-Oz6EH9"
        USER_ID = "3504185"
        USERNAME = "ItsCoreyE"
        PING_ROLE_ID = "1396163147311616141"  # Using existing milestones role
        
        # Create and run the CSV stats notifier
        notifier = CSVStatsNotifier(CSV_STATS_WEBHOOK_URL, USER_ID, USERNAME, PING_ROLE_ID)
        success, message = notifier.post_csv_stats_to_discord(stats_data)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'CSV stats notification sent to Discord',
                'revenue': stats_data.get('totalRevenue', 0),
                'sales': stats_data.get('totalSales', 0),
                'period': stats_data.get('dataPeriod', 'Unknown')
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to send CSV stats notification',
                'details': message,
                'revenue': stats_data.get('totalRevenue', 0)
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
            '/csv-stats-webhook': 'POST - Send CSV stats notifications',
            '/health': 'GET - Health check'
        }
    })

if __name__ == '__main__':
    # For local testing
    app.run(debug=True, host='0.0.0.0', port=5000)
