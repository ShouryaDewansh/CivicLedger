import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoteFormProps {
  pollId: string;
  options: string[];
  onVoteSuccess: (leaf: string) => void;
  disabled?: boolean;
}

const VoteForm = ({ pollId, options, onVoteSuccess, disabled }: VoteFormProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Import dynamically to avoid build issues
      const { createVoteCommitment } = await import('@/utils/crypto');
      const { castVote } = await import('@/utils/api');
      const { storeVoteData, storeReceipt } = await import('@/utils/storage');
      const { toast } = await import('@/hooks/use-toast');

      // Create commitment
      const { leaf, voteData } = createVoteCommitment(pollId, selectedOption, secret);

      // Store vote data
      storeVoteData(leaf, voteData);

      // Cast vote
      const { receipt } = await castVote(pollId, leaf);

      // Store receipt
      storeReceipt(receipt);

      toast({
        title: 'Vote cast successfully!',
        description: 'Your vote has been recorded and you can verify it anytime.',
      });

      onVoteSuccess(leaf);

      // Reset form
      setSelectedOption('');
      setSecret('');
    } catch (error) {
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: 'Error casting vote',
        description: error instanceof Error ? error.message : 'Failed to cast vote',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="space-y-6 p-6 rounded-xl border border-border bg-card shadow-glow"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">Cast Your Vote</h3>
        <p className="text-sm text-muted-foreground">
          Select an option and optionally add a secret for extra privacy
        </p>
      </div>

      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedOption(option)}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-1 cursor-pointer font-medium"
              >
                {option}
              </Label>
            </motion.div>
          ))}
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="secret" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Add Secret (Optional)
        </Label>
        <Input
          id="secret"
          type="password"
          placeholder="e.g., a random passphrase for extra security"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          disabled={disabled}
        />
        <p className="text-xs text-muted-foreground">
          This is combined with your choice for privacy. Leave empty for auto-generated secret.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!selectedOption || isSubmitting || disabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Vote...
          </>
        ) : (
          'Submit Vote'
        )}
      </Button>
    </motion.form>
  );
};

export default VoteForm;
