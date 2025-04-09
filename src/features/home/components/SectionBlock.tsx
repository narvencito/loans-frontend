import { motion } from 'framer-motion';

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
      className="bg-white shadow-md rounded-xl p-6 border border-muted"
    >
      <h2 className="text-2xl font-semibold text-primary mb-6">{title}</h2>
      <div className="space-y-6">
        {content.map((item, idx) => (
          <div key={idx} className="text-gray-700">
            {item.step ? (
              <div className="flex items-start gap-4">
                <span className="text-3xl font-bold text-secondary">{item.step}</span>
                <div>
                  <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-primary mb-1">{item.title}</h3>
                <p>{item.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
