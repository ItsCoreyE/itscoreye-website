import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { milestone, progress } = await request.json();

    if (!milestone || !progress) {
      return NextResponse.json(
        { success: false, error: 'Missing milestone or progress data' },
        { status: 400 }
      );
    }

    // Fetch thumbnail for collectibles
    let thumbnailUrl = null;
    if (milestone.category === 'collectibles' && milestone.assetId) {
      try {
        console.log(`🖼️ Fetching thumbnail for collectible: ${milestone.description} (ID: ${milestone.assetId})`);
        
        const thumbnailResponse = await fetch(`${request.nextUrl.origin}/api/roblox?assetId=${milestone.assetId}`);
        if (thumbnailResponse.ok) {
          const thumbnailData = await thumbnailResponse.json();
          if (thumbnailData.success && thumbnailData.thumbnail) {
            thumbnailUrl = thumbnailData.thumbnail;
            console.log(`✅ Got thumbnail for ${milestone.description}`);
          } else {
            console.log(`⚠️ No thumbnail available for ${milestone.description}`);
          }
        }
      } catch (thumbnailError) {
        console.error(`❌ Error fetching thumbnail for ${milestone.description}:`, thumbnailError);
      }
    }

    // Prepare data for PythonAnywhere webhook
    const webhookData = {
      milestone: {
        id: milestone.id,
        category: milestone.category,
        target: milestone.target,
        description: milestone.description,
        isCompleted: milestone.isCompleted,
        assetId: milestone.assetId || null,
        thumbnailUrl: thumbnailUrl
      },
      progress: {
        revenue_completed: progress.revenue_completed,
        revenue_total: progress.revenue_total,
        sales_completed: progress.sales_completed,
        sales_total: progress.sales_total,
        items_completed: progress.items_completed,
        items_total: progress.items_total,
        collectibles_completed: progress.collectibles_completed || 0,
        collectibles_total: progress.collectibles_total || 0,
        total_completed: progress.total_completed,
        total_milestones: progress.total_milestones,
        completion_percentage: progress.completion_percentage
      }
    };

    // PythonAnywhere webhook URL
    const PYTHONANYWHERE_WEBHOOK_URL = 'https://itscoreyedwards.pythonanywhere.com/milestone-webhook';
    
    console.log('🚀 Sending milestone notification to PythonAnywhere...');
    console.log('📊 Milestone:', milestone.description);
    console.log('🎯 Category:', milestone.category);
    
    try {
      const response = await fetch(PYTHONANYWHERE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        console.log('✅ PythonAnywhere response:', responseData);
        
        return NextResponse.json({
          success: true,
          message: 'Milestone notification sent to Discord',
          milestone: milestone.description,
          category: milestone.category,
          pythonAnywhereResponse: responseData
        });
      } else {
        console.error('❌ PythonAnywhere error:', responseData);
        
        return NextResponse.json({
          success: false,
          error: 'Failed to send milestone notification',
          details: responseData.error || 'Unknown error',
          milestone: milestone.description
        }, { status: 500 });
      }
      
    } catch (fetchError: unknown) {
      console.error('❌ Failed to reach PythonAnywhere:', fetchError);
      
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
      
      return NextResponse.json({
        success: false,
        error: 'Failed to reach notification service',
        details: errorMessage,
        milestone: milestone.description
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Milestone webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
