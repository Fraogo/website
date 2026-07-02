import { redirect } from 'next/navigation'

// The rental landing page previously showed two equal cards ("Hire" vs "Become
// a Vendor") which added a click of friction before visitors saw any vendors.
// Both destinations are now directly reachable from the navbar, so this URL
// redirects straight to the vendor grid.
export default function RentalPage() {
  redirect('/general-service/rental/hire-vendor')
}
