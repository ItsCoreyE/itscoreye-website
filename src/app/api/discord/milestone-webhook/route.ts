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

    // Prepare data for PythonAnywhere webhook
    const webhookData = {
      milestone: {
        id: milestone.id,
        category: milestone.category,
        target: milestone.target,
        description: milestone.description,
        isCompleted: milestone.isCompleted
      },
      progress: {
        revenue_completed: progress.revenue_completed,
        revenue_total: progress.revenue_total,
        sales_completed: progress.sales_completed,
        sales_total: progress.sales_total,
        items_completed: progress.items_completed,
        items_total: progress.items_total,
        total_completed: progress.total_completed,
        total_milestones: progress.total_milestones,
        completion_percentage: progress.completion_percentage
      }
    };

    // Replace 'yourusername' with your actual PythonAnywhere username
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
      
    } catch (fetchError: any) {
      console.error('❌ Failed to reach PythonAnywhere:', fetchError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to reach notification service',
        details: fetchError.message,
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
