import { track } from '@vercel/analytics'

// Custom events for Business Planning App
export const analytics = {
  // Business Plan Events
  planCreated: (planName: string) => {
    track('plan_created', { plan_name: planName })
  },

  planSaved: (planName: string) => {
    track('plan_saved', { plan_name: planName })
  },

  planLoaded: (planName: string) => {
    track('plan_loaded', { plan_name: planName })
  },

  // Product Events
  productAdded: (productType: string) => {
    track('product_added', { product_type: productType })
  },

  productUpdated: (productType: string) => {
    track('product_updated', { product_type: productType })
  },

  // Employee Events
  employeeAdded: (paymentMode: string) => {
    track('employee_added', { payment_mode: paymentMode })
  },

  // Cost Events
  costAdded: (costType: 'fixed' | 'variable', category: string) => {
    track('cost_added', { cost_type: costType, category })
  },

  // Analysis Events
  analysisViewed: () => {
    track('analysis_viewed')
  },

  chartViewed: (chartType: string) => {
    track('chart_viewed', { chart_type: chartType })
  },

  // Export Events
  pdfExported: (planName: string) => {
    track('pdf_exported', { plan_name: planName })
  },

  excelExported: (planName: string) => {
    track('excel_exported', { plan_name: planName })
  },

  // ROI Simulator Events
  roiSimulatorUsed: () => {
    track('roi_simulator_used')
  },

  roiSimulationSaved: (code: string) => {
    track('roi_simulation_saved', { simulation_code: code })
  },

  roiSimulationLoaded: (code: string) => {
    track('roi_simulation_loaded', { simulation_code: code })
  },

  roiScenarioChanged: (scenario: string) => {
    track('roi_scenario_changed', { scenario })
  },

  roiCalculated: (roi: number, paybackPeriod: number) => {
    track('roi_calculated', { 
      roi: Math.round(roi * 100) / 100, 
      payback_period: paybackPeriod 
    })
  },

  // What-If Scenario Events
  scenarioCreated: (scenarioType: string) => {
    track('scenario_created', { scenario_type: scenarioType })
  },

  // Target Events
  targetSet: (targetRevenue: number, projectionPeriod: number) => {
    track('target_set', { 
      target_revenue: targetRevenue, 
      projection_period: projectionPeriod 
    })
  },

  // Navigation Events
  tabSwitched: (tabName: string) => {
    track('tab_switched', { tab_name: tabName })
  },

  // Feature Usage
  featureUsed: (featureName: string) => {
    track('feature_used', { feature_name: featureName })
  },

  // Error Events
  errorOccurred: (errorType: string, errorMessage: string) => {
    track('error_occurred', { 
      error_type: errorType, 
      error_message: errorMessage 
    })
  }
}
