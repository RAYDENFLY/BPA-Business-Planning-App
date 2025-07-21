// Types for Business Planning Application

export interface Product {
  id: string;
  name: string;
  price: number;
  type: 'subscription' | 'one-time' | 'service';
  estimatedSalesPerMonth: number;
  targetGrowthPercent: number;
  salesCommission: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  paymentMode: 'fixed' | 'commission';
  salary?: number;
  commission?: {
    productId?: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
  estimatedContribution?: string;
}

export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  category: 'rent' | 'utilities' | 'software' | 'salary' | 'other';
}

export interface VariableCost {
  id: string;
  name: string;
  type: 'per-unit' | 'percentage' | 'fixed';
  value: number;
  productId?: string;
  category: 'production' | 'payment-gateway' | 'support' | 'advertising' | 'commission' | 'other';
}

export interface BusinessTarget {
  targetRevenue: number;
  projectionPeriod: number; // in months
  revenueGrowthPercent: number;
  costGrowthPercent: number;
  salesClosingRate: number;
  costInflationRate: number;
}

export interface MonthlyProjection {
  month: number;
  revenue: number;
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  cashFlow: number;
  cumulativeProfit: number;
}

export interface BusinessAnalysis {
  monthlyProjections: MonthlyProjection[];
  breakEvenMonth: number | null;
  totalProfit12Months: number;
  roi: number;
  averageMonthlyRevenue: number;
  averageMonthlyCosts: number;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  changes: {
    priceIncrease?: number;
    costReduction?: number;
    newEmployee?: Partial<Employee>;
    commissionChange?: number;
  };
}

export interface BusinessPlan {
  id: string;
  name: string;
  products: Product[];
  employees: Employee[];
  fixedCosts: FixedCost[];
  variableCosts: VariableCost[];
  businessTarget: BusinessTarget;
  createdAt: Date;
  updatedAt: Date;
}
