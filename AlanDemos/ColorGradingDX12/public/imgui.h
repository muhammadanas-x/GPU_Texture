#pragma once

#include "technique.h"

namespace ColorGrading
{
    inline void ShowToolTip(const char* tooltip)
    {
        if (!tooltip || !tooltip[0])
            return;

        ImGui::SameLine();
        ImGui::PushStyleColor(ImGuiCol_Text, IM_COL32(255, 255, 0, 255));
        ImGui::Text("[?]");
        ImGui::PopStyleColor();
        if (ImGui::IsItemHovered(ImGuiHoveredFlags_AllowWhenDisabled))
            ImGui::SetTooltip("%s", tooltip);
    }

    void MakeUI(Context* context, ID3D12CommandQueue* commandQueue)
    {
        ImGui::PushID("gigi_ColorGrading");

        ImGui::Checkbox("RenderScene", &context->m_input.variable_RenderScene);
        ShowToolTip("If true, renders a scene instead of showing an image");
        {
            static const char* labels[] = {
                "Polynomial",
                "TextureDeCasteljau",
                "TextureSeiler",
            };
            ImGui::Combo("CurveType", (int*)&context->m_input.variable_CurveType, labels, 3);
        }
        {
            static const char* labels[] = {
                "Linear",
                "Quadratic",
                "Cubic",
                "Quartic",
                "Quintic",
            };
            ImGui::Combo("CurveOrder", (int*)&context->m_input.variable_CurveOrder, labels, 5);
        }
        ImGui::ColorEdit3("CP1", &context->m_input.variable_CP1[0]);
        ImGui::ColorEdit3("CP2", &context->m_input.variable_CP2[0]);
        ImGui::ColorEdit3("CP3", &context->m_input.variable_CP3[0]);
        ImGui::ColorEdit3("CP4", &context->m_input.variable_CP4[0]);
        ImGui::ColorEdit3("CP5", &context->m_input.variable_CP5[0]);
        ImGui::ColorEdit3("CP6", &context->m_input.variable_CP6[0]);
        ImGui::InputInt("RaysPerPixelPerFrame", &context->m_input.variable_RaysPerPixelPerFrame, 0);
        ShowToolTip("Rays per pixel per frame when rendering the scene");
        context->m_input.variable_NormalizedCPs = ImGui::Button("NormalizedCPs");
        ShowToolTip("When clicked, makes a linear no-op curve out of the control points");

        ImGui::Checkbox("Profile", &context->m_profile);
        if (context->m_profile)
        {
            int numEntries = 0;
            const ProfileEntry* entries = context->ReadbackProfileData(commandQueue, numEntries);
            if (ImGui::BeginTable("profiling", 3, ImGuiTableFlags_Borders | ImGuiTableFlags_RowBg))
            {
                ImGui::TableSetupColumn("Label");
                ImGui::TableSetupColumn("CPU ms");
                ImGui::TableSetupColumn("GPU ms");
                ImGui::TableHeadersRow();
                float totalCpu = 0.0f;
                float totalGpu = 0.0f;
                for (int entryIndex = 0; entryIndex < numEntries; ++entryIndex)
                {
                    ImGui::TableNextRow();
                    ImGui::TableNextColumn();
                    ImGui::TextUnformatted(entries[entryIndex].m_label);
                    ImGui::TableNextColumn();
                    ImGui::Text("%0.3f", entries[entryIndex].m_cpu * 1000.0f);
                    ImGui::TableNextColumn();
                    ImGui::Text("%0.3f", entries[entryIndex].m_gpu * 1000.0f);
                    totalCpu += entries[entryIndex].m_cpu;
                    totalGpu += entries[entryIndex].m_gpu;
                }
                ImGui::EndTable();
            }
        }

        ImGui::PopID();
    }
};
