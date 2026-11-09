#!/usr/bin/env python3
"""Baixa a biblioteca de efeitos sonoros da Mixkit (licença gratuita da Mixkit: uso em vídeos, inclusive monetizados;
proibido redistribuir o som sozinho, por isso o pacote não traz os arquivos, só esta lista).
Uso: baixar_sons.py   -> ~/.animador/sons/<categoria>/mkNNNN_nome.wav e o índice (sons_indice.py)
"""
import os, subprocess, sys, tempfile, urllib.request
LISTA = [
"ambiente/mk1191_distant_sea_humming.wav",
"ambiente/mk1200_windy_sea_loop.wav",
"ambiente/mk1782_night_crickets.wav",
"ambiente/mk2472_morning_birds.wav",
"ambiente/mk2658_wind_blowing.wav",
"ambiente/mk375_street_walking_people.wav",
"ambiente/mk447_office_ambience.wav",
"camera/mk1133_camera_shutter_click.wav",
"camera/mk1432_camera_digital_shutter.wav",
"caneta/mk2367_writing_pen_paper.wav",
"caneta/mk2370_fast_signing_pen.wav",
"caneta/mk2376_short_pencil_writing.wav",
"caneta/mk2998_pen_marker_line.wav",
"carimbo/mk2182_wood_hard_hit.wav",
"carimbo/mk2995_stapling_paper.wav",
"celular/mk1350_office_telephone_ring.wav",
"celular/mk2354_message_pop_alert.wav",
"celular/mk2356_dry_pop_up_notification.wav",
"celular/mk2862_dial_phone_tone.wav",
"celular/mk933_bell_notification.wav",
"clique/mk1109_select_click.wav",
"clique/mk1111_mouse_hard_clicking.wav",
"clique/mk1113_mouse_click_close.wav",
"clique/mk1117_classic_click.wav",
"clique/mk1120_modern_click_box_check.wav",
"clique/mk2568_cool_interface_click.wav",
"clique/mk275_fast_double_click_mouse.wav",
"clique/mk2997_clear_mouse_clicks.wav",
"correto/mk2865_success_software_tone.wav",
"correto/mk947_correct_answer_notification.wav",
"correto/mk949_correct_positive_answer.wav",
"correto/mk952_correct_answer_reward.wav",
"correto/mk953_correct_answer_fast.wav",
"correto/mk957_correct_positive_notification.wav",
"ding/mk1791_cooking_bell_ding.wav",
"ding/mk2015_winning_chimes.wav",
"ding/mk2350_magic_sparkle_whoosh.wav",
"ding/mk2870_correct_answer_tone.wav",
"ding/mk600_achievement_bell.wav",
"ding/mk931_service_bell.wav",
"ding/mk951_positive_notification.wav",
"dinheiro/mk1936_magical_coin_win.wav",
"dinheiro/mk1939_coins_handling.wav",
"dinheiro/mk1989_money_bag_drop.wav",
"dinheiro/mk1992_coin_win_notification.wav",
"dinheiro/mk1993_clinking_coins.wav",
"dinheiro/mk1996_slot_machine_payout.wav",
"dinheiro/mk1997_classic_winner_alarm.wav",
"dinheiro/mk1999_gold_coin_prize.wav",
"dinheiro/mk2000_melodic_gold_price.wav",
"dinheiro/mk2003_coins_sound.wav",
"dinheiro/mk2841_atm_key_press.wav",
"erro/mk2876_funny_fail_low_tone.wav",
"erro/mk2964_system_beep_buzzer_fail.wav",
"erro/mk3219_wrong_answer_game_show.wav",
"erro/mk472_slow_sad_trombone_fail.wav",
"erro/mk473_cartoon_failure_piano.wav",
"erro/mk568_fail_drum_xylophone.wav",
"erro/mk946_wrong_answer_fail.wav",
"erro/mk948_wrong_answer_bass_buzzer.wav",
"erro/mk950_game_show_wrong_buzz.wav",
"erro/mk954_wrong_long_buzzer.wav",
"grave/mk2299_short_bass_hit.wav",
"grave/mk2300_knocking_sub_bass.wav",
"grave/mk2303_futuristic_bass_hit.wav",
"grave/mk549_deep_cinematic_subtle_drum.wav",
"grave/mk563_drum_deep_impact.wav",
"humor/mk523_small_group_applause.wav",
"humor/mk566_drum_roll.wav",
"humor/mk579_drum_joke_accent.wav",
"impacto/mk1485_metal_hit_woosh.wav",
"impacto/mk2903_movie_whoosh_impact_presentation.wav",
"impacto/mk2908_movie_trailer_epic_impact.wav",
"impacto/mk772_quick_zoom_impact.wav",
"interface/mk3089_news_report_transition.wav",
"papel/mk1104_page_turn_single.wav",
"papel/mk1105_big_paper_page_turn.wav",
"papel/mk1530_paper_slide.wav",
"papel/mk2379_papers_wrinkling.wav",
"papel/mk2380_paper_quick_movement.wav",
"papel/mk2385_paper_crinkle.wav",
"papel/mk2653_papers_blowing_wind.wav",
"papel/mk386_newspaper_falling.wav",
"passos/mk1269_walking_stones_loop.wav",
"passos/mk356_walking_crowd_indoor.wav",
"passos/mk542_footsteps_heels_pavement.wav",
"passos/mk543_footsteps_tunnel_loop.wav",
"pop/mk2357_bubble_pop_up_alert.wav",
"pop/mk2358_long_pop.wav",
"pop/mk2359_silly_pop_cluster.wav",
"pop/mk2364_hard_pop_click.wav",
"pop/mk2365_electric_pop.wav",
"pop/mk2925_soap_bubble.wav",
"pop/mk3005_explainer_pops_whoosh.wav",
"porta/mk1523_heavy_sliding_door.wav",
"porta/mk195_creaky_door_open.wav",
"porta/mk196_door_hard_shut.wav",
"porta/mk197_knocking_wooden_door.wav",
"porta/mk201_prison_metal_door_close.wav",
"relogio/mk1053_ticking_counter.wav",
"relogio/mk1059_tick_tock_close.wav",
"relogio/mk1063_fast_wall_clock_ticking.wav",
"relogio/mk1064_watch_knob_spin.wav",
"risada/mk364_big_crowd_talking.wav",
"risada/mk411_male_casual_laugh.wav",
"risada/mk416_female_cheerful_laughter.wav",
"risada/mk424_crowd_laugh.wav",
"risada/mk432_reporters_camera_flashes.wav",
"riser/mk645_cinematic_synth_riser.wav",
"riser/mk784_reverse_cinematic_impact.wav",
"riser/mk790_cinematic_trailer_riser.wav",
"scratch/mk702_record_vinyl_scratch.wav",
"scratch/mk704_vinyl_stop_fast_scratch.wav",
"teclado/mk1376_typing_electronic_device.wav",
"teclado/mk1392_fast_laptop_typing.wav",
"teclado/mk1393_smartphone_typing.wav",
"teclado/mk1395_typing_text_smartphone.wav",
"teclado/mk2531_typing_laptop_keyboard.wav",
"teclado/mk2533_single_key_type.wav",
"teclado/mk2534_keyboard_key_presses.wav",
"teclado/mk2535_phone_keyboard_bit.wav",
"teclado/mk2538_hard_laptop_typing.wav",
"teclado/mk2541_single_key_press_laptop.wav",
"teclado/mk2542_hard_single_key_laptop.wav",
"veiculo/mk1536_old_car_arriving.wav",
"veiculo/mk1538_fast_car_drive_by.wav",
"veiculo/mk1564_car_door_slam.wav",
"veiculo/mk1586_vintage_airplane_landing.wav",
"veiculo/mk1588_airplane_flying_by.wav",
"whoosh/mk1167_swoosh_wind_passing.wav",
"whoosh/mk1461_short_wind_swoosh.wav",
"whoosh/mk1464_quick_swoosh_accent.wav",
"whoosh/mk1465_vacuum_swoosh.wav",
"whoosh/mk1468_cinematic_transition_wind_swoosh.wav",
"whoosh/mk1469_flying_fast_swoosh.wav",
"whoosh/mk1474_transition_windy_swoosh.wav",
"whoosh/mk1487_dagger_woosh.wav",
"whoosh/mk1489_air_woosh.wav",
"whoosh/mk1490_fast_whoosh_transition.wav",
"whoosh/mk1491_arrow_whoosh.wav",
"whoosh/mk1492_cinematic_whoosh_fast_transition.wav",
"whoosh/mk164_fast_sweeping_transition.wav",
"whoosh/mk166_fast_small_sweep.wav",
"whoosh/mk167_long_sweeping_air_swoosh.wav",
"whoosh/mk168_fast_air_sweep_transition.wav",
"whoosh/mk169_futuristic_sweep_pass_by.wav",
"whoosh/mk174_fast_sweep_transition.wav",
"whoosh/mk175_short_transition_sweep.wav",
"whoosh/mk2604_deep_air_woosh.wav",
"whoosh/mk2607_fast_air_woosh.wav",
"whoosh/mk2608_air_zoom_vacuum.wav",
"whoosh/mk2638_magic_transition_sweep.wav",
"whoosh/mk2639_quick_metal_transition_sweep.wav",
"whoosh/mk3114_fast_scifi_transition_sweep.wav",
"whoosh/mk3115_fast_transitions_swoosh.wav",
"whoosh/mk3120_technology_transition_slide.wav",
"whoosh/mk3161_transition_flying_swoosh.wav",
"whoosh/mk787_cinematic_whoosh_stutter.wav"
]
RAIZ = os.path.expanduser('~/.animador/sons')


def main():
    novos = 0
    for rel in LISTA:
        dst = os.path.join(RAIZ, rel)
        if os.path.exists(dst):
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        n = os.path.basename(rel)[2:].split('_')[0]
        url = f'https://assets.mixkit.co/active_storage/sfx/{n}/{n}-preview.mp3'
        tmp = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False).name
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            open(tmp, 'wb').write(urllib.request.urlopen(req, timeout=60).read())
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-ar', '48000', '-ac', '2', dst], check=True)
            novos += 1
        except Exception as e:
            print('falhou', rel, e)
        finally:
            os.remove(tmp)
    open(os.path.join(RAIZ, 'LICENCAS.md'), 'w', encoding='utf-8').write('# Sons

Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree): uso em vídeos, inclusive comerciais; não redistribuir o som sozinho. O número no nome é o item da Mixkit.
')
    print(novos, 'sons novos')
    subprocess.run([sys.executable, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sons_indice.py')])


if __name__ == '__main__':
    main()
