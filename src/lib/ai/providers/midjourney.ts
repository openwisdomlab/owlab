// Midjourney API Integration
// Note: Midjourney doesn't have an official API, so this uses proxy services
// Common proxy services: goapi.ai, replicate wrappers, or self-hosted solutions

export interface MidjourneyOptions {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  style?: "raw" | "cute" | "expressive" | "scenic";
  chaos?: number; // 0-100
  stylize?: number; // 0-1000
  quality?: 0.25 | 0.5 | 1;
  version?: "5.2" | "6" | "6.1";
}

export interface MidjourneyResult {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  imageUrl?: string;
  progress?: number;
  error?: string;
}

export async function generateWithMidjourney(
  options: MidjourneyOptions
): Promise<MidjourneyResult> {
  const apiKey = process.env.MIDJOURNEY_API_KEY;
  const apiUrl = process.env.MIDJOURNEY_API_URL || "https://api.goapi.ai/mj/v2";

  if (!apiKey) {
    throw new Error("MIDJOURNEY_API_KEY is not configured");
  }

  // Build the prompt with parameters
  let fullPrompt = options.prompt;

  if (options.aspectRatio && options.aspectRatio !== "1:1") {
    fullPrompt += ` --ar ${options.aspectRatio}`;
  }
  if (options.style) {
    fullPrompt += ` --style ${options.style}`;
  }
  if (options.chaos !== undefined) {
    fullPrompt += ` --chaos ${options.chaos}`;
  }
  if (options.stylize !== undefined) {
    fullPrompt += ` --stylize ${options.stylize}`;
  }
  if (options.quality !== undefined) {
    fullPrompt += ` --quality ${options.quality}`;
  }
  if (options.version) {
    fullPrompt += ` --v ${options.version}`;
  }
  if (options.negativePrompt) {
    fullPrompt += ` --no ${options.negativePrompt}`;
  }

  try {
    const response = await fetch(`${apiUrl}/imagine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        process_mode: "fast",
        webhook_endpoint: "",
        webhook_secret: "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Midjourney API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.task_id,
      status: "pending",
    };
  } catch (error) {
    return {
      id: "",
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getMidjourneyStatus(taskId: string): Promise<MidjourneyResult> {
  const apiKey = process.env.MIDJOURNEY_API_KEY;
  const apiUrl = process.env.MIDJOURNEY_API_URL || "https://api.goapi.ai/mj/v2";

  if (!apiKey) {
    throw new Error("MIDJOURNEY_API_KEY is not configured");
  }

  try {
    const response = await fetch(`${apiUrl}/fetch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        task_id: taskId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Midjourney API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: taskId,
      status: data.status === "finished" ? "completed" : data.status,
      imageUrl: data.task_result?.image_url,
      progress: data.progress,
    };
  } catch (error) {
    return {
      id: taskId,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
