import { prisma } from '@/lib/db'

export async function seedSolarVendors() {
  try {
    const vendors = [
      {
        businessName: 'Fraogo Solar & Renewable Energy',
        email: 'solar@fraogo.com',
        phone: '+234 802 822 9002',
        location: 'Ikeja, Lagos, Nigeria',
        businessType: 'Solar & Energy',
        description:
          'Official FRAOGO Solar division supplying high-efficiency Tier-1 Monocrystalline Solar Panels (550W), Hybrid Solar Inverters (3.5kVA - 10kVA), Lithium-ion Powerwalls (48V 200Ah), and all-in-one solar street lights with full warranty.',
        status: 'active',
        portfolioImages: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
              fileName: 'solar-panels-roof.jpg',
            },
            {
              url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1200&auto=format&fit=crop',
              fileName: 'inverter-lithium-setup.jpg',
            },
          ],
        },
      },
      {
        businessName: 'Helios Power Solutions Ltd',
        email: 'sales@heliospower.ng',
        phone: '+234 812 345 6789',
        location: 'Lekki Phase 1, Lagos',
        businessType: 'Solar & Energy',
        description:
          'Certified solar engineers specializing in commercial and residential solar installations, high-capacity tubular batteries, solar water pumping systems, and automatic transfer switches (ATS).',
        status: 'active',
        portfolioImages: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop',
              fileName: 'helios-solar-farm.jpg',
            },
          ],
        },
      },
    ]

    for (const v of vendors) {
      const existing = await prisma.vendor.findFirst({
        where: { businessName: v.businessName },
      })
      if (!existing) {
        await prisma.vendor.create({ data: v })
      }
    }
    return { success: true }
  } catch (err) {
    console.error('Seed solar error:', err)
    return { success: false }
  }
}
