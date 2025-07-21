import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BusinessPlan, Product, Employee, FixedCost, VariableCost, BusinessTarget, MonthlyProjection, BusinessAnalysis } from '@/types/business';

interface BusinessStore {
  // Current business plan
  currentPlan: BusinessPlan | null;
  
  // Actions for products
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  
  // Actions for employees
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  
  // Actions for fixed costs
  addFixedCost: (cost: Omit<FixedCost, 'id'>) => void;
  updateFixedCost: (id: string, cost: Partial<FixedCost>) => void;
  removeFixedCost: (id: string) => void;
  
  // Actions for variable costs
  addVariableCost: (cost: Omit<VariableCost, 'id'>) => void;
  updateVariableCost: (id: string, cost: Partial<VariableCost>) => void;
  removeVariableCost: (id: string) => void;
  
  // Actions for business targets
  updateBusinessTarget: (target: BusinessTarget) => void;
  
  // Business plan management
  createNewPlan: (name: string) => void;
  loadPlan: (plan: BusinessPlan) => void;
  clearPlan: () => void;
  
  // Analysis
  calculateProjections: () => MonthlyProjection[];
  getBusinessAnalysis: () => BusinessAnalysis | null;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set, get) => ({
      currentPlan: null,
      
      addProduct: (product) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            products: [...state.currentPlan.products, { ...product, id: generateId() }],
            updatedAt: new Date(),
          }
        };
      }),
      
      updateProduct: (id, updates) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            products: state.currentPlan.products.map(p => 
              p.id === id ? { ...p, ...updates } : p
            ),
            updatedAt: new Date(),
          }
        };
      }),
      
      removeProduct: (id) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            products: state.currentPlan.products.filter(p => p.id !== id),
            updatedAt: new Date(),
          }
        };
      }),
      
      addEmployee: (employee) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            employees: [...state.currentPlan.employees, { ...employee, id: generateId() }],
            updatedAt: new Date(),
          }
        };
      }),
      
      updateEmployee: (id, updates) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            employees: state.currentPlan.employees.map(e => 
              e.id === id ? { ...e, ...updates } : e
            ),
            updatedAt: new Date(),
          }
        };
      }),
      
      removeEmployee: (id) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            employees: state.currentPlan.employees.filter(e => e.id !== id),
            updatedAt: new Date(),
          }
        };
      }),
      
      addFixedCost: (cost) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            fixedCosts: [...state.currentPlan.fixedCosts, { ...cost, id: generateId() }],
            updatedAt: new Date(),
          }
        };
      }),
      
      updateFixedCost: (id, updates) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            fixedCosts: state.currentPlan.fixedCosts.map(c => 
              c.id === id ? { ...c, ...updates } : c
            ),
            updatedAt: new Date(),
          }
        };
      }),
      
      removeFixedCost: (id) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            fixedCosts: state.currentPlan.fixedCosts.filter(c => c.id !== id),
            updatedAt: new Date(),
          }
        };
      }),
      
      addVariableCost: (cost) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            variableCosts: [...state.currentPlan.variableCosts, { ...cost, id: generateId() }],
            updatedAt: new Date(),
          }
        };
      }),
      
      updateVariableCost: (id, updates) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            variableCosts: state.currentPlan.variableCosts.map(c => 
              c.id === id ? { ...c, ...updates } : c
            ),
            updatedAt: new Date(),
          }
        };
      }),
      
      removeVariableCost: (id) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            variableCosts: state.currentPlan.variableCosts.filter(c => c.id !== id),
            updatedAt: new Date(),
          }
        };
      }),
      
      updateBusinessTarget: (target) => set((state) => {
        if (!state.currentPlan) return state;
        return {
          currentPlan: {
            ...state.currentPlan,
            businessTarget: target,
            updatedAt: new Date(),
          }
        };
      }),
      
      createNewPlan: (name) => set(() => ({
        currentPlan: {
          id: generateId(),
          name,
          products: [],
          employees: [],
          fixedCosts: [],
          variableCosts: [],
          businessTarget: {
            targetRevenue: 100000000, // 100 juta
            projectionPeriod: 12,
            revenueGrowthPercent: 10,
            costGrowthPercent: 5,
            salesClosingRate: 20,
            costInflationRate: 3,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      })),
      
      loadPlan: (plan) => set(() => ({ currentPlan: plan })),
      
      clearPlan: () => set(() => ({ currentPlan: null })),
      
      calculateProjections: () => {
        const state = get();
        if (!state.currentPlan) return [];
        
        const { products, employees, fixedCosts, variableCosts, businessTarget } = state.currentPlan;
        const projections: MonthlyProjection[] = [];
        let cumulativeProfit = 0;
        
        for (let month = 1; month <= businessTarget.projectionPeriod; month++) {
          // Calculate monthly revenue
          let monthlyRevenue = 0;
          products.forEach(product => {
            const growthFactor = Math.pow(1 + businessTarget.revenueGrowthPercent / 100, month - 1);
            const salesThisMonth = product.estimatedSalesPerMonth * growthFactor;
            monthlyRevenue += salesThisMonth * product.price;
          });
          
          // Calculate fixed costs
          const costGrowthFactor = Math.pow(1 + businessTarget.costGrowthPercent / 100, month - 1);
          let monthlyFixedCosts = 0;
          
          // Employee salaries
          employees.forEach(employee => {
            if (employee.paymentMode === 'fixed' && employee.salary) {
              monthlyFixedCosts += employee.salary * costGrowthFactor;
            }
          });
          
          // Other fixed costs
          fixedCosts.forEach(cost => {
            monthlyFixedCosts += cost.amount * costGrowthFactor;
          });
          
          // Calculate variable costs
          let monthlyVariableCosts = 0;
          variableCosts.forEach(cost => {
            if (cost.type === 'percentage') {
              monthlyVariableCosts += (monthlyRevenue * cost.value) / 100;
            } else if (cost.type === 'fixed') {
              monthlyVariableCosts += cost.value;
            }
          });
          
          // Calculate commissions
          let monthlyCommissions = 0;
          employees.forEach(employee => {
            if (employee.paymentMode === 'commission' && employee.commission) {
              if (employee.commission.type === 'percentage') {
                monthlyCommissions += (monthlyRevenue * employee.commission.value) / 100;
              } else {
                monthlyCommissions += employee.commission.value;
              }
            }
          });
          
          const totalCosts = monthlyFixedCosts + monthlyVariableCosts + monthlyCommissions;
          const grossProfit = monthlyRevenue - monthlyVariableCosts;
          const netProfit = monthlyRevenue - totalCosts;
          const cashFlow = netProfit; // Simplified cash flow
          cumulativeProfit += netProfit;
          
          projections.push({
            month,
            revenue: monthlyRevenue,
            fixedCosts: monthlyFixedCosts,
            variableCosts: monthlyVariableCosts + monthlyCommissions,
            totalCosts,
            grossProfit,
            netProfit,
            cashFlow,
            cumulativeProfit,
          });
        }
        
        return projections;
      },
      
      getBusinessAnalysis: () => {
        const projections = get().calculateProjections();
        if (projections.length === 0) return null;
        
        const breakEvenMonth = projections.findIndex(p => p.cumulativeProfit > 0) + 1;
        const totalProfit12Months = projections[projections.length - 1]?.cumulativeProfit || 0;
        const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
        const totalCosts = projections.reduce((sum, p) => sum + p.totalCosts, 0);
        const roi = totalCosts > 0 ? (totalProfit12Months / totalCosts) * 100 : 0;
        
        return {
          monthlyProjections: projections,
          breakEvenMonth: breakEvenMonth > 0 ? breakEvenMonth : null,
          totalProfit12Months,
          roi,
          averageMonthlyRevenue: totalRevenue / projections.length,
          averageMonthlyCosts: totalCosts / projections.length,
        };
      },
    }),
    {
      name: 'business-storage',
    }
  )
);
