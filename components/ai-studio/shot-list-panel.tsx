'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { List, ArrowRight } from 'lucide-react';

interface ShotListPanelProps {
  directions: any[];
  onNext: () => void;
}

export function ShotListPanel({ directions, onNext }: ShotListPanelProps) {
  if (directions.length === 0) {
    return (
      <div className="text-center py-12">
        <List className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">Please complete Visual Director first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Step 4: Shot List</h2>
        <p className="text-muted-foreground">
          Complete production shot list for your video crew
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Scene</TableHead>
            <TableHead>Visual</TableHead>
            <TableHead>Camera</TableHead>
            <TableHead>Movement</TableHead>
            <TableHead>Lighting</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directions.map((direction: any, index: number) => (
            <TableRow key={index}>
              <TableCell>
                <Badge variant="outline">Scene {direction.scene}</Badge>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="text-sm line-clamp-2">{direction.visual}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm font-medium">{direction.camera}</p>
                <p className="text-xs text-muted-foreground">{direction.lens}</p>
              </TableCell>
              <TableCell className="text-sm">{direction.movement}</TableCell>
              <TableCell className="text-sm">{direction.lighting}</TableCell>
              <TableCell>
                <Badge variant="secondary">~3s</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={onNext} size="lg">
        Next: Motion Plan
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}
