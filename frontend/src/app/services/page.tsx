import ServicesPage from '@/components/ServicesPage/ServicesPage';
import Breadcrumbs from '@/components/Header/Breadcrumbs';
import { Suspense } from 'react'

export default function Services() {
  return (
    <Suspense fallback={null}>
      <Breadcrumbs />
      <ServicesPage />
    </Suspense>
  )
}
