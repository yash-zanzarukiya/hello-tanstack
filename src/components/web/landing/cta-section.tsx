import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { LampContainer } from '@/components/ui/lamp'
import { motion } from 'motion/react'

export function CtaSection() {
  return (
    <section className="relative border-t rounded-full">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            Ready to Build Your
            <br />
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Knowledge Base?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of researchers, creators, and professionals who use
            ReCoil to save and understand the web.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <ShimmerButton
                shimmerColor="oklch(0.905 0.182 98.111)"
                background="oklch(0.205 0 0)"
                className="px-8 py-3 text-base font-medium dark:[--bg:oklch(0.795_0.184_86.047)]"
              >
                Get Started for Free
                <ArrowRight className="ml-2" aria-hidden="true" />
              </ShimmerButton>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required
          </p>
        </motion.div>
      </LampContainer>
    </section>
  )
}
