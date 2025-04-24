import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionBlockProps {
  id: string;
  title: string;
  content: {
    title: string;
    description: string;
    step?: string;
  }[];
  index: number;
}

export default function SectionBlock({ id, title, content, index }: SectionBlockProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-card text-card-foreground shadow-lg rounded-xl p-6 border border-muted space-y-6"
    >
      <h2 className="text-2xl font-bold text-primary">{title}</h2>

      {content.map((item, idx) => (
        <div key={idx} className="text-muted-foreground">
          {item.step ? (
            <div className="flex items-start gap-4">
              <span className="text-3xl font-bold text-secondary">{item.step}</span>
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">{item.title}</h3>
                <p className="text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-primary mb-1">{item.title}</h3>
              <p className="text-sm leading-relaxed">{item.description}</p>
            </>
          )}
        </div>
      ))}
    </motion.section>
  );
}
