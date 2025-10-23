'use client'

import Link from 'next/link'
import { Plane, Github, Twitter, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Product Column */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/plan" className="text-sm text-muted-foreground hover:text-foreground">Plan Trip</Link></li>
              <li><Link href="/suggested" className="text-sm text-muted-foreground hover:text-foreground">Suggested Trips</Link></li>
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">Documentation</Link></li>
              <li><Link href="/status" className="text-sm text-muted-foreground hover:text-foreground">Status</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
              <li><Link href="/gdpr" className="text-sm text-muted-foreground hover:text-foreground">GDPR</Link></li>
            </ul>
          </div>

          {/* About & Social Links */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Plane className="h-5 w-5 text-primary" />
                <h4 className="text-base font-semibold">AI Travel Guide</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered companion for creating perfect travel experiences for Indian travelers. Plan, discover, and explore the world with cultural insights and local recommendations.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="mailto:contact@example.com" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground order-last sm:order-first">
              © 2025 AI Travel Guide. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with <span className="text-red-500">❤</span>  Harsh
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
