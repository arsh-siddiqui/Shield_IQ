import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import Card from "./ui/Card";

export default function Timeline({ steps, activeStep, onStepClick }) {
  return (
    <div className="relative">
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 md:left-1/2 md:-translate-x-1/2" />
      <div className="space-y-8">
        {steps.map((step, i) => {
          const Icon = Icons[step.icon] || Icons.Circle;
          const isActive = activeStep === step.id;
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className={`relative flex items-start gap-4 md:w-1/2 ${
                isLeft ? "md:pr-10" : "md:ml-auto md:pl-10"
              }`}
            >
              <button
                onClick={() => onStepClick?.(step.id)}
                className={`z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 border-surface flex-shrink-0 transition-colors ${
                  isActive ? "bg-primary text-white" : "bg-white text-primary shadow-soft"
                } md:absolute md:top-0 ${isLeft ? "md:-right-6" : "md:-left-6"}`}
              >
                <Icon className="w-5 h-5" />
              </button>
              <Card
                hover
                onClick={() => onStepClick?.(step.id)}
                className={`p-5 cursor-pointer flex-1 ${isActive ? "ring-2 ring-primary" : ""}`}
              >
                <div className="text-xs font-semibold text-primary mb-1">Step {step.id}</div>
                <h4 className="font-bold text-ink mb-1.5">{step.title}</h4>
                <p className="text-sm text-ink-light leading-relaxed">{step.description}</p>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2"
                  >
                    <Icons.Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-ink-light leading-relaxed">
                      <span className="font-semibold text-ink">Safety tip: </span>
                      {step.tip}
                    </p>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
