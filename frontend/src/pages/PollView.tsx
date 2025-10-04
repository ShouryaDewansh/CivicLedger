import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Share2, FileText, Loader2, RefreshCw, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { getPoll, getSnapshots, createSnapshot } from '@/utils/api';
import { getAllReceiptsForPoll } from '@/utils/storage';
import { copyToClipboard } from '@/utils/formatting';
import { Poll, Receipt, VoteData, Snapshot } from '@/types';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import VoteForm from '@/components/poll/VoteForm';
import ReceiptCard from '@/components/poll/ReceiptCard';
import ReceiptModal from '@/components/poll/ReceiptModal';
import SnapshotCard from '@/components/snapshot/SnapshotCard';

const PollView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [poll, setPoll] = useState<Poll | null>(null);
  const [receipts, setReceipts] = useState<Array<{ receipt: Receipt; voteData: VoteData | null }>>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<{ receipt: Receipt; voteData: VoteData | null } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);

  useEffect(() => {
    if (id) {
      loadPollData();
      loadReceipts();
      loadSnapshots();
    }
  }, [id]);

  const loadPollData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await getPoll(id);
      setPoll(data);
    } catch (error) {
      toast({
        title: 'Error loading poll',
        description: error instanceof Error ? error.message : 'Poll not found',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReceipts = () => {
    if (!id) return;
    const userReceipts = getAllReceiptsForPoll(id);
    setReceipts(userReceipts);
  };

  const loadSnapshots = async () => {
    if (!id) return;
    try {
      const data = await getSnapshots(id);
      setSnapshots(data);
    } catch (error) {
      console.error('Error loading snapshots:', error);
    }
  };

  const handleVoteSuccess = (leaf: string) => {
    loadPollData();
    loadReceipts();
  };

  const handleSharePoll = () => {
    const url = window.location.href;
    copyToClipboard(url);
    toast({
      title: 'Link copied!',
      description: 'Poll link copied to clipboard',
    });
  };

  const handleViewReceipt = (receipt: Receipt, voteData: VoteData | null) => {
    setSelectedReceipt({ receipt, voteData });
    setIsModalOpen(true);
  };

  const handleCreateSnapshot = async () => {
    if (!id) return;
    
    setIsCreatingSnapshot(true);
    try {
      await createSnapshot(id);
      toast({
        title: 'Snapshot created!',
        description: 'A new snapshot has been created for this poll',
      });
      loadSnapshots();
    } catch (error) {
      toast({
        title: 'Error creating snapshot',
        description: error instanceof Error ? error.message : 'Failed to create snapshot',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingSnapshot(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!poll) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-primary/5">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Poll Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{poll.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {poll.count !== undefined && (
                  <Badge variant="secondary" className="text-base px-4 py-1">
                    {poll.count} {poll.count === 1 ? 'vote' : 'votes'}
                  </Badge>
                )}
                <code className="text-xs bg-muted px-3 py-1 rounded">
                  ID: {poll.id.slice(0, 8)}...
                </code>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSharePoll}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" onClick={loadPollData}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Vote Form */}
          <div className="lg:col-span-2">
            <VoteForm
              pollId={poll.id}
              options={poll.options}
              onVoteSuccess={handleVoteSuccess}
            />
          </div>

          {/* Right: Receipts & Snapshots */}
          <div className="space-y-6">
            {/* Your Votes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Votes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {receipts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No votes yet. Cast your vote above!
                    </p>
                  ) : (
                    receipts.map(({ receipt, voteData }) => (
                      <ReceiptCard
                        key={receipt.leaf}
                        receipt={receipt}
                        voteData={voteData}
                        onViewDetails={() => handleViewReceipt(receipt, voteData)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Snapshots */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Snapshots</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCreateSnapshot}
                      disabled={isCreatingSnapshot}
                    >
                      {isCreatingSnapshot ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Create'
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {snapshots.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No snapshots yet
                    </p>
                  ) : (
                    snapshots.map((snapshot, index) => (
                      <SnapshotCard key={snapshot.id} snapshot={snapshot} index={index} />
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />

      <ReceiptModal
        receipt={selectedReceipt?.receipt || null}
        voteData={selectedReceipt?.voteData || null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PollView;
