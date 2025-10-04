import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { GitBranch, Lock, Shield, FileCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const About = () => {
  const cryptoSteps = [
    {
      title: 'Vote Commitment',
      description: 'Your vote choice is combined with a secret and hashed twice (SHA-256) client-side to create a commitment.',
    },
    {
      title: 'Merkle Tree Construction',
      description: 'All vote commitments are added as leaves to a Merkle tree, creating a tamper-evident data structure.',
    },
    {
      title: 'Inclusion Proof',
      description: 'You receive a cryptographic proof showing your leaf\'s path from bottom to root of the tree.',
    },
    {
      title: 'Verification',
      description: 'Anyone can verify your vote was included by recomputing the path from your leaf to the published root hash.',
    },
  ];

  const faqs = [
    {
      question: 'Is my vote really private?',
      answer: 'Yes! Your actual vote choice is never sent to the server. Only a cryptographic hash (commitment) is submitted. Without your secret, no one can determine how you voted.',
    },
    {
      question: 'How does verification work?',
      answer: 'You receive a Merkle proof - a series of hashes showing the path from your vote to the root hash. By recomputing these hashes, you can mathematically prove your vote is in the tree.',
    },
    {
      question: 'What is a Merkle tree?',
      answer: 'A Merkle tree is a tree-like data structure where each leaf is a hash of data, and each parent node is a hash of its children. The root hash uniquely represents all data, making tampering easily detectable.',
    },
    {
      question: 'Can someone change my vote?',
      answer: 'No. Changing any vote would change the Merkle root hash. Since you have a proof linking your vote to a specific root, any tampering would be immediately detectable when you verify.',
    },
    {
      question: 'What are snapshots?',
      answer: 'Snapshots are timestamped records of the Merkle tree root hash, digitally signed by the server. They provide an immutable audit trail of the poll state at different points in time.',
    },
    {
      question: 'Is this production-ready?',
      answer: 'No, this is an educational prototype. Production voting systems require additional features like voter authentication, sybil resistance, coercion resistance, and formal security audits.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">How CivicLedger Works</h1>
            <p className="text-xl text-muted-foreground">
              Understanding privacy-preserving cryptographic voting
            </p>
          </div>

          {/* What is a Merkle Tree */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <GitBranch className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">What is a Merkle Tree?</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg text-muted-foreground mb-6">
                  A Merkle tree is a cryptographic data structure that allows efficient and secure verification of large datasets. 
                  Each vote is a "leaf" at the bottom of the tree. Pairs of leaves are hashed together to create parent nodes, 
                  which are then hashed together again, continuing until a single "root hash" remains.
                </p>
                <div className="bg-muted/50 p-8 rounded-lg">
                  <pre className="text-sm font-mono text-center">
{`                  ROOT
                   /  \\
                 /      \\
               /          \\
            HASH1        HASH2
            /  \\          /  \\
          /      \\      /      \\
      Vote1   Vote2  Vote3   Vote4`}
                  </pre>
                </div>
                <p className="text-muted-foreground mt-6">
                  <strong>Key property:</strong> Changing any single vote changes the entire path from that leaf to the root, 
                  making tampering immediately detectable.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* How Voting Works */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">How Voting Works</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {cryptoSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* What is an Inclusion Proof */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <FileCheck className="h-8 w-8 text-verified" />
              <h2 className="text-3xl font-bold">What is an Inclusion Proof?</h2>
            </div>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="text-lg text-muted-foreground">
                  An inclusion proof (also called a Merkle proof) is a set of hashes that proves a specific piece of data 
                  exists in the tree without revealing the entire dataset.
                </p>
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Example Verification:</h4>
                  <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                    <li>Start with your vote leaf hash</li>
                    <li>Hash it with the sibling hash provided in proof</li>
                    <li>Hash that result with the next sibling in the path</li>
                    <li>Continue until you reach the root</li>
                    <li>Compare computed root with published root - if they match, vote is verified!</li>
                  </ol>
                </div>
                <p className="text-muted-foreground">
                  This allows you to verify your vote was counted without downloading the entire poll database.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Security Considerations */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold">Security Considerations</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="text-verified">✓</div>
                    <div>
                      <strong>Privacy:</strong> Votes are hashed before submission, hiding your choice
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-verified">✓</div>
                    <div>
                      <strong>Verifiability:</strong> Cryptographic proofs allow independent verification
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-verified">✓</div>
                    <div>
                      <strong>Integrity:</strong> Merkle trees make tampering detectable
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-destructive">✗</div>
                    <div>
                      <strong>Authentication:</strong> No voter authentication (anyone can vote multiple times)
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-destructive">✗</div>
                    <div>
                      <strong>Coercion Resistance:</strong> Receipts could be used to prove how you voted
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Limitations */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h2 className="text-3xl font-bold">Limitations</h2>
            </div>
            <Card className="border-destructive/50">
              <CardContent className="pt-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>This is a <strong>prototype for educational purposes</strong>, not production-ready</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>No voter authentication - anyone can cast unlimited votes</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>Receipts could enable vote buying or coercion in real elections</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>Server must be trusted to not manipulate votes before adding to tree</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>No protection against denial of service attacks</span>
                  </li>
                  <li className="flex gap-3">
                    <span>•</span>
                    <span>Signature verification of snapshots not fully implemented</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
