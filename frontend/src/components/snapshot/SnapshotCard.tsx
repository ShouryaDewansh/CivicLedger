import { Snapshot } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, FileCheck } from 'lucide-react';
import { formatTimestamp } from '@/utils/formatting';
import { truncateHash } from '@/utils/crypto';
import { copyToClipboard } from '@/utils/formatting';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface SnapshotCardProps {
  snapshot: Snapshot;
  index: number;
}

const SnapshotCard = ({ snapshot, index }: SnapshotCardProps) => {
  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Snapshot #{snapshot.id}
            </CardTitle>
            <Badge variant="outline">{formatTimestamp(snapshot.created_at)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Root Hash</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted p-2 rounded flex-1 font-mono">
                  {truncateHash(snapshot.root, 8)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(snapshot.root, 'Root hash')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Signature</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted p-2 rounded flex-1 font-mono">
                  {truncateHash(snapshot.signature, 8)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(snapshot.signature, 'Signature')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {snapshot.cid && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">IPFS CID</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted p-2 rounded flex-1 font-mono">
                  {snapshot.cid}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://ipfs.io/ipfs/${snapshot.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SnapshotCard;
