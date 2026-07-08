import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import jsPDF from 'jspdf';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brandId = params.id;

    // Get brand and verify ownership
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Create PDF
    const doc = new jsPDF();
    let yPos = 20;

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return lines.length * fontSize * 0.35; // Return height used
    };

    // Title Page
    doc.setFillColor(147, 51, 234); // Purple
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.text('BRAND GUIDELINES', 105, 25, { align: 'center' });
    doc.setFontSize(18);
    doc.text(brand.name || '', 105, 33, { align: 'center' });

    yPos = 55;
    doc.setTextColor(0, 0, 0);

    // Tagline
    if (brand.tagline) {
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text(`"${brand.tagline}"`, 105, yPos, { align: 'center' });
      yPos += 15;
    }

    // Basic Information Section
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPos, 190, 8, 'F');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('BASIC INFORMATION', 15, yPos + 6);
    yPos += 15;

    if (brand.industry) {
      doc.setFontSize(12);
      doc.text('Industry:', 15, yPos);
      doc.setFontSize(10);
      doc.text(brand.industry, 45, yPos);
      yPos += 7;
    }

    if (brand.niche) {
      doc.setFontSize(12);
      doc.text('Niche:', 15, yPos);
      doc.setFontSize(10);
      doc.text(brand.niche, 45, yPos);
      yPos += 7;
    }

    if (brand.description) {
      doc.setFontSize(12);
      doc.text('Description:', 15, yPos);
      yPos += 7;
      const descHeight = addText(brand.description, 15, yPos, 180, 10);
      yPos += descHeight + 5;
    }

    yPos += 5;

    // Mission & Vision Section
    if (brand.mission || brand.vision) {
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPos, 190, 8, 'F');
      doc.setFontSize(16);
      doc.text('MISSION & VISION', 15, yPos + 6);
      yPos += 15;

      if (brand.mission) {
        doc.setFontSize(12);
        doc.text('Mission:', 15, yPos);
        yPos += 7;
        const missionHeight = addText(brand.mission, 15, yPos, 180, 10);
        yPos += missionHeight + 7;
      }

      if (brand.vision) {
        doc.setFontSize(12);
        doc.text('Vision:', 15, yPos);
        yPos += 7;
        const visionHeight = addText(brand.vision, 15, yPos, 180, 10);
        yPos += visionHeight + 7;
      }
    }

    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    // Brand Voice & Tone Section
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPos, 190, 8, 'F');
    doc.setFontSize(16);
    doc.text('BRAND VOICE & TONE', 15, yPos + 6);
    yPos += 15;

    if (brand.tone && brand.tone.length > 0) {
      doc.setFontSize(12);
      doc.text('Tone:', 15, yPos);
      doc.setFontSize(10);
      doc.text(brand.tone.join(', '), 45, yPos);
      yPos += 10;
    }

    if (brand.voice) {
      doc.setFontSize(12);
      doc.text('Voice Description:', 15, yPos);
      yPos += 7;
      const voiceHeight = addText(brand.voice, 15, yPos, 180, 10);
      yPos += voiceHeight + 10;
    }

    // Voice Profile from AI Analysis
    const voiceProfile = (brand as any).voiceProfile;
    if (voiceProfile) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(12);
      doc.text('Voice Analysis (AI-Powered):', 15, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.text(`Consistency Score: ${voiceProfile.consistencyScore}%`, 20, yPos);
      yPos += 7;
      doc.text(`Confidence Score: ${voiceProfile.confidenceScore}%`, 20, yPos);
      yPos += 10;

      if (voiceProfile.writingPatterns && voiceProfile.writingPatterns.length > 0) {
        doc.setFontSize(11);
        doc.text('Writing Patterns:', 20, yPos);
        yPos += 7;
        doc.setFontSize(9);
        voiceProfile.writingPatterns.slice(0, 5).forEach((pattern: string) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`• ${pattern}`, 25, yPos);
          yPos += 6;
        });
        yPos += 5;
      }
    }

    // Target Audience Section
    if (brand.targetAudience) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPos, 190, 8, 'F');
      doc.setFontSize(16);
      doc.text('TARGET AUDIENCE', 15, yPos + 6);
      yPos += 15;

      const audienceHeight = addText(brand.targetAudience, 15, yPos, 180, 10);
      yPos += audienceHeight + 10;
    }

    // Keywords Section
    if (brand.keywords && brand.keywords.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPos, 190, 8, 'F');
      doc.setFontSize(16);
      doc.text('BRAND KEYWORDS', 15, yPos + 6);
      yPos += 15;

      doc.setFontSize(10);
      const keywordsText = brand.keywords.join(', ');
      const keywordsHeight = addText(keywordsText, 15, yPos, 180, 10);
      yPos += keywordsHeight + 10;
    }

    // Brand Colors Section
    if (brand.brandColors && brand.brandColors.length > 0) {
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPos, 190, 8, 'F');
      doc.setFontSize(16);
      doc.text('BRAND COLORS', 15, yPos + 6);
      yPos += 15;

      let xPos = 15;
      brand.brandColors.forEach((color: string, index: number) => {
        if (xPos > 170) {
          xPos = 15;
          yPos += 25;
        }

        // Parse color (assuming hex format)
        let r = 0, g = 0, b = 0;
        if (color.startsWith('#')) {
          const hex = color.substring(1);
          r = parseInt(hex.substring(0, 2), 16);
          g = parseInt(hex.substring(2, 4), 16);
          b = parseInt(hex.substring(4, 6), 16);
        }

        // Draw color box
        doc.setFillColor(r, g, b);
        doc.rect(xPos, yPos, 20, 15, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(xPos, yPos, 20, 15, 'S');

        // Draw color label
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text(color, xPos + 10, yPos + 20, { align: 'center' });

        xPos += 35;
      });

      yPos += 30;
    }

    // Footer on last page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by Bangla Creator | Page ${i} of ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${brand.name.replace(/\s+/g, '-')}-Brand-Guidelines.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
