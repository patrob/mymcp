import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPricingTiersByInterval, calculateAnnualSavings, PRICING_TIERS } from './stripe'

describe('Stripe Utilities', () => {
  describe('getPricingTiersByInterval', () => {
    it('returns only monthly tiers when interval is month', () => {
      const monthlyTiers = getPricingTiersByInterval('month')
      
      expect(monthlyTiers.every(tier => tier.interval === 'month')).toBe(true)
      expect(monthlyTiers.length).toBeGreaterThan(0)
    })

    it('returns only annual tiers when interval is year', () => {
      const annualTiers = getPricingTiersByInterval('year')
      
      expect(annualTiers.every(tier => tier.interval === 'year')).toBe(true)
      expect(annualTiers.length).toBeGreaterThan(0)
    })

    it('includes Free tier in both monthly and annual results', () => {
      const monthlyTiers = getPricingTiersByInterval('month')
      const annualTiers = getPricingTiersByInterval('year')
      
      const monthlyFree = monthlyTiers.find(tier => tier.id === 'free')
      const annualFree = annualTiers.find(tier => tier.id === 'free')
      
      expect(monthlyFree).toBeDefined()
      expect(annualFree).toBeDefined()
      expect(monthlyFree?.popular).toBe(true)
      expect(annualFree?.popular).toBe(true)
    })

    it('includes paid tiers with comingSoon flag', () => {
      const monthlyTiers = getPricingTiersByInterval('month')
      
      const devTier = monthlyTiers.find(tier => tier.id === 'dev')
      const proTier = monthlyTiers.find(tier => tier.id === 'pro')
      const teamTier = monthlyTiers.find(tier => tier.id === 'team')
      
      expect(devTier?.comingSoon).toBe(true)
      expect(proTier?.comingSoon).toBe(true)
      expect(teamTier?.comingSoon).toBe(true)
    })
  })

  describe('calculateAnnualSavings', () => {
    it('calculates savings correctly for 17% discount', () => {
      const monthlyPrice = 29
      const annualPrice = 290 // 17% savings from 348
      
      const result = calculateAnnualSavings(monthlyPrice, annualPrice)
      
      expect(result.savings).toBe(58) // 348 - 290
      expect(result.savingsPercentage).toBe(17) // rounded
    })

    it('calculates savings for Developer tier', () => {
      const monthlyPrice = 14
      const annualPrice = 140 // Should be 17% savings from 168
      
      const result = calculateAnnualSavings(monthlyPrice, annualPrice)
      
      expect(result.savings).toBe(28) // 168 - 140
      expect(result.savingsPercentage).toBe(17) // rounded
    })

    it('calculates savings for Team tier', () => {
      const monthlyPrice = 140
      const annualPrice = 1400 // Should be 17% savings from 1680
      
      const result = calculateAnnualSavings(monthlyPrice, annualPrice)
      
      expect(result.savings).toBe(280) // 1680 - 1400
      expect(result.savingsPercentage).toBe(17) // rounded
    })

    it('handles zero monthly price', () => {
      const result = calculateAnnualSavings(0, 0)
      
      expect(result.savings).toBe(0)
      expect(result.savingsPercentage).toBe(0)
    })

    it('handles edge case where annual is more expensive', () => {
      const monthlyPrice = 10
      const annualPrice = 150 // More than 12 * 10
      
      const result = calculateAnnualSavings(monthlyPrice, annualPrice)
      
      expect(result.savings).toBe(-30) // Negative savings
      expect(result.savingsPercentage).toBe(-25) // Negative percentage
    })
  })

  describe('PRICING_TIERS', () => {
    it('contains Free tier for both monthly and annual', () => {
      const freeTiers = PRICING_TIERS.filter(tier => tier.id === 'free')
      
      expect(freeTiers).toHaveLength(2)
      expect(freeTiers.some(tier => tier.interval === 'month')).toBe(true)
      expect(freeTiers.some(tier => tier.interval === 'year')).toBe(true)
    })

    it('has popular flag on Free tiers only', () => {
      const popularTiers = PRICING_TIERS.filter(tier => tier.popular)
      
      expect(popularTiers.every(tier => tier.id === 'free')).toBe(true)
      expect(popularTiers).toHaveLength(2) // Both monthly and annual Free
    })

    it('has comingSoon flag on all paid tiers', () => {
      const paidTiers = PRICING_TIERS.filter(tier => tier.id !== 'free')
      
      expect(paidTiers.every(tier => tier.comingSoon === true)).toBe(true)
    })

    it('has correct pricing structure', () => {
      const devMonthly = PRICING_TIERS.find(tier => tier.id === 'dev' && tier.interval === 'month')
      const devAnnual = PRICING_TIERS.find(tier => tier.id === 'dev' && tier.interval === 'year')
      const proMonthly = PRICING_TIERS.find(tier => tier.id === 'pro' && tier.interval === 'month')
      const teamMonthly = PRICING_TIERS.find(tier => tier.id === 'team' && tier.interval === 'month')
      
      expect(devMonthly?.price).toBe(14)
      expect(devAnnual?.price).toBe(140)
      expect(proMonthly?.price).toBe(29)
      expect(teamMonthly?.price).toBe(140)
    })

    it('has correct server limits', () => {
      const freeTier = PRICING_TIERS.find(tier => tier.id === 'free')
      const devTier = PRICING_TIERS.find(tier => tier.id === 'dev')
      const proTier = PRICING_TIERS.find(tier => tier.id === 'pro')
      const teamTier = PRICING_TIERS.find(tier => tier.id === 'team')
      
      expect(freeTier?.maxServers).toBe(0)
      expect(devTier?.maxServers).toBe(1)
      expect(proTier?.maxServers).toBe(3)
      expect(teamTier?.maxServers).toBe(-1) // unlimited
    })
  })
})