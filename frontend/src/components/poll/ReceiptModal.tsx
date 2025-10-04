import { useState, useEffect } from 'react';
import { Receipt, VoteData } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Download, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { formatTimestamp } from '@/utils/formatting';
import { verifyReceipt, truncateHash } from '@/utils/crypto';
import { downloadReceipt } from '@/utils/storage';
import { copyToClipboard } from '@/utils/formatting';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptModalProps {
  receipt: Receipt | null;
  voteData: VoteData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptModal = ({ receipt, voteData, isOpen, onClose }: ReceiptModalProps) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showProof, setShowProof] = useState(false);

  useEffect(() => {
    if (receipt && isOpen) {
      handleVerify();
    }
  }, [receipt, isOpen]);

  const handleVerify = async () => {
    if (!receipt) return;
    
    setIsVerifying(true);
    try {
      const result = await verifyReceipt(receipt);
      setIsVerified(result);
    } catch (error) {
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const handleDownload = () => {
    if (receipt) {
      downloadReceipt(receipt, voteData);
    }
  };

  if (!receipt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Receipt Details</DialogTitle>
            {isVerified !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Badge
                  variant={isVerified ? 'default' : 'destructive'}
                  className={`text-sm ${isVerified ? 'bg-verified shadow-verified' : ''}`}
                >
                  {isVerified ? (
                    <>
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Proof Verified
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-4 w-4" />
                      Proof Failed
                    </>
                  )}
                </Badge>
              </motion.div>
            )}
          </div>
          <DialogDescription>
            {isVerified
              ? 'Your vote has been cryptographically verified to be in the Merkle tree'
              : isVerified === false
              ? 'Verification failed - the proof does not match'
              : 'Verifying...'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {voteData && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-muted-foreground mb-1">Your Vote:</p>
              <p className="text-xl font-bold text-foreground">{voteData.option}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receipt Index</p>
              <p className="text-lg font-mono">{receipt.index}</p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-muted-foreground">Leaf Hash</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(receipt.leaf, 'Leaf hash')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                {receipt.leaf}
              </p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-muted-foreground">Root Hash</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(receipt.root, 'Root hash')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm font-mono bg-muted p-2 rounded break-all">
                {receipt.root}
              </p>
            </div>

            <Separator />

            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProof(!showProof)}
                className="w-full justify-between"
              >
                <span className="text-sm font-medium">
                  Merkle Proof ({receipt.proof.length} hashes)
                </span>
                {showProof ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              
              <AnimatePresence>
                {showProof && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 mt-2 overflow-hidden"
                  >
                    {receipt.proof.map((hash, index) => (
                      <div
                        key={index}
                        className="p-2 rounded bg-muted/50 flex items-center justify-between"
                      >
                        <span className="text-xs font-mono">{truncateHash(hash, 12)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(hash, `Proof hash ${index}`)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                <p className="text-sm">{formatTimestamp(receipt.timestamp)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                <p className="text-sm">{receipt.nLeaves}</p>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-muted-foreground">Server Signature</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(receipt.signature, 'Signature')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                {truncateHash(receipt.signature, 20)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleVerify} disabled={isVerifying} variant="outline" className="flex-1">
              {isVerifying ? 'Verifying...' : 'Verify Again'}
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptModal;
