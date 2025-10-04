import { useState, useEffect } from 'react';
import { Receipt, VoteData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Eye, Download } from 'lucide-react';
import { formatTimestamp } from '@/utils/formatting';
import { verifyReceipt } from '@/utils/crypto';
import { downloadReceipt } from '@/utils/storage';
import { motion } from 'framer-motion';

interface ReceiptCardProps {
  receipt: Receipt;
  voteData: VoteData | null;
  onViewDetails: () => void;
}

const ReceiptCard = ({ receipt, voteData, onViewDetails }: ReceiptCardProps) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Auto-verify on mount
    handleVerify();
  }, [receipt]);

  const handleVerify = async () => {
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

  const handleDownload = () => {
    downloadReceipt(receipt, voteData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden ${isVerified ? 'shadow-verified animate-pulse-glow' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">Receipt #{receipt.index}</CardTitle>
            {isVerified !== null && (
              <Badge
                variant={isVerified ? 'default' : 'destructive'}
                className={isVerified ? 'bg-verified' : ''}
              >
                {isVerified ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="mr-1 h-3 w-3" />
                    Failed
                  </>
                )}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {voteData && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-medium text-muted-foreground">Your Choice:</p>
              <p className="text-base font-semibold text-foreground">{voteData.option}</p>
            </div>
          )}

          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">
              Cast on {formatTimestamp(receipt.timestamp)}
            </p>
            <p className="text-muted-foreground">
              Position: {receipt.index + 1} of {receipt.nLeaves}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReceiptCard;
