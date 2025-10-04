import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, CheckCircle2, GitBranch, ArrowRight, Vote } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

const Home = () => {
  const navigate = useNavigate();
  const [pollId, setPollId] = useState('');

  const handleViewPoll = () => {
    if (pollId.trim()) {
      navigate(`/poll/${pollId.trim()}`);
    }
  };

  const features = [
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Votes are hashed client-side before submission. Your choice remains private.',
      color: 'text-primary',
    },
    {
      icon: CheckCircle2,
      title: 'Verifiable',
      description: 'Get cryptographic proof your vote was counted with Merkle tree verification.',
      color: 'text-verified',
    },
    {
      icon: GitBranch,
      title: 'Transparent',
      description: 'Merkle trees ensure tamper-evident records. Trust through cryptography.',
      color: 'text-accent',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Hash Your Vote',
      description: 'Your vote is cryptographically hashed in your browser before submission.',
    },
    {
      number: '02',
      title: 'Receive Proof',
      description: 'Get an inclusion receipt with a Merkle proof of your vote in the tree.',
    },
    {
      number: '03',
      title: 'Verify Anytime',
      description: 'Independently verify your vote was counted using the cryptographic proof.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-primary/5">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block p-4 rounded-2xl bg-primary/10 mb-6"
            >
              <Vote className="h-16 w-16 text-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              CivicLedger
            </h1>
            
            <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Privacy-Preserving Verifiable Voting
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Cast your vote anonymously. Verify it was counted. Trust through cryptography.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/create')}
                className="text-lg px-8 shadow-glow group"
              >
                Create Poll
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Enter Poll ID"
                  value={pollId}
                  onChange={(e) => setPollId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleViewPoll()}
                  className="sm:w-64"
                />
                <Button variant="outline" onClick={handleViewPoll}>
                  View Poll
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-glow transition-all duration-300 border-2 hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className={`inline-block p-3 rounded-xl bg-primary/10 ${feature.color}`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20 bg-muted/30 rounded-3xl my-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to cast and verify your vote
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className="relative"
              >
                <div className="space-y-4">
                  <div className="text-6xl font-bold text-primary/20">{step.number}</div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-6 text-primary/30">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center max-w-3xl mx-auto p-12 rounded-2xl gradient-primary text-primary-foreground shadow-glow"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Create your first poll or learn more about how cryptographic voting works
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/create')}
                className="text-lg px-8"
              >
                Create Your First Poll
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/about')}
                className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
