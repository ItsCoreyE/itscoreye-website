import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { statsData } = await request.json();

    if (!statsData) {
      return NextResponse.json(
        { success: false, error: 'Missing stats data' },
        { status: 400 }
      );
    }

    // Prepare data for PythonAnywhere CSV stats webhook
    const webhookData = {
      statsData: {
        totalRevenue: statsData.totalRevenue,
        totalSales: statsData.totalSales,
        growthPercentage: statsData.growthPercentage,
        dataPeriod: statsData.dataPeriod,
        lastUpdated: statsData.lastUpdated,
        topItems: statsData.topItems || [],
        uploadType: statsData.uploadType || 'single' // 'single' or 'growth'
      }
    };

    // PythonAnywhere CSV stats webhook URL
    const PYTHONANYWHERE_WEBHOOK_URL = 'https://itscoreyedwards.pythonanywhere.com/csv-stats-webhook';
    
    console.log('📊 Sending CSV stats notification to PythonAnywhere...');
    console.log('💰 Revenue:', statsData.totalRevenue);
    console.log('🛍️ Sales:', statsData.totalSales);
    console.log('📈 Growth:', statsData.growthPercentage + '%');
    console.log('📅 Period:', statsData.dataPeriod);
    
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
        console.log('✅ PythonAnywhere CSV stats response:', responseData);
        
        return NextResponse.json({
          success: true,
          message: 'CSV stats notification sent to Discord',
          revenue: statsData.totalRevenue,
          sales: statsData.totalSales,
          period: statsData.dataPeriod,
          pythonAnywhereResponse: responseData
        });
      } else {
        console.error('❌ PythonAnywhere CSV stats error:', responseData);
        
        return NextResponse.json({
          success: false,
          error: 'Failed to send CSV stats notification',
          details: responseData.error || 'Unknown error',
          revenue: statsData.totalRevenue
        }, { status: 500 });
      }
      
    } catch (fetchError: unknown) {
      console.error('❌ Failed to reach PythonAnywhere for CSV stats:', fetchError);
      
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error occurred';
      
      return NextResponse.json({
        success: false,
        error: 'Failed to reach CSV stats notification service',
        details: errorMessage,
        revenue: statsData.totalRevenue
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ CSV stats webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
